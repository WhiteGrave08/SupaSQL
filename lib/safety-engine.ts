import { Table, Column, Relationship } from '../types';

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
export type AccessScope = 'public' | 'authenticated' | 'service_role' | 'private';
export type DeployStatus = 'blocked' | 'warning' | 'safe';

export interface SecurityAnalysis {
    risk: RiskLevel;
    accessScope: AccessScope;
    deployStatus: DeployStatus;
    reasons: string[];
    missingPolicies: string[];
}

// Heuristic patterns for PII / Sensitive data
const SENSITIVE_PATTERNS = [
    'password', 'hash', 'secret', 'token', 'key',
    'email', 'phone', 'ssn', 'credit', 'card', 'balance', 'salary'
];

const TENANT_KEYS = ['org_id', 'organization_id', 'tenant_id', 'workspace_id', 'user_id', 'owner_id'];

export const SafetyEngine = {
    analyzeTable: (table: Table, relationships: Relationship[]): SecurityAnalysis => {
        const reasons: string[] = [];
        let riskScore = 0; // 0-10 scale

        // 1. Analyze Sensitivity (Columns)
        const sensitiveCols = table.columns.filter(c =>
            SENSITIVE_PATTERNS.some(p => c.name.toLowerCase().includes(p)) ||
            (c.semanticType && ['email', 'password_hash', 'currency'].includes(c.semanticType))
        );

        if (sensitiveCols.length > 0) {
            riskScore += 5;
            reasons.push(`Contains sensitive fields: ${sensitiveCols.map(c => c.name).join(', ')}`);
        }

        // 2. Analyze Isolation (RLS / Tenant ID)
        // Note: In a real app we'd check actual RLS policy definitions from DB.
        // Here we simulate "No RLS" if it's in our mock list of "unprotected" tables or just default to High if sensitive.
        const hasTenantKey = table.columns.some(c => TENANT_KEYS.includes(c.name));

        // Heuristic: If it has sensitive data but No Tenant Key, it's potentially Global/System data (High risk if public)
        if (sensitiveCols.length > 0 && !hasTenantKey && table.name !== 'users') {
            riskScore += 2;
            reasons.push("Sensitive data without tenant isolation (potential global leak)");
        }

        if (table.name === 'users' || table.name.includes('billing') || table.name.includes('secrets')) {
            riskScore += 10; // Maximally critical
        }

        // 3. Determine Risk Level
        let risk: RiskLevel = 'low';
        if (riskScore >= 8) risk = 'critical';
        else if (riskScore >= 5) risk = 'high';
        else if (riskScore >= 2) risk = 'medium';

        // 4. Check for Actual RLS Policies
        const hasRLS = table.policies && table.policies.length > 0;

        // If RLS is enabled, downgrading risk significantly
        if (hasRLS) {
            risk = 'low';
            riskScore = 0;
        }

        const accessScope: AccessScope = hasRLS ? 'authenticated' : 'public';
        const deployStatus: DeployStatus = risk === 'critical' ? 'blocked' : (risk === 'high' ? 'warning' : 'safe');

        if (risk === 'critical') reasons.push("CRITICAL: High-value target exposed publicly");

        return {
            risk,
            accessScope,
            deployStatus,
            reasons,
            missingPolicies: hasTenantKey ? ['Tenant Isolation'] : ['Owner Access']
        };
    },

    generateSuggestedPolicies: (table: Table): string[] => {
        const policies = [];
        const hasOwner = table.columns.some(c => TENANT_KEYS.includes(c.name) || c.name === 'user_id' || c.name === 'owner_id');

        // 1. Basic Read Policy
        policies.push(`CREATE POLICY "Enable read access for authenticated users" ON "${table.name}" FOR SELECT TO authenticated USING (true);`);

        // 2. Owner Write Policy (Senior Pattern)
        if (hasOwner) {
            const ownerCol = table.columns.find(c => TENANT_KEYS.includes(c.name) || c.name === 'user_id' || c.name === 'owner_id')?.name || 'user_id';
            policies.push(`CREATE POLICY "Users can only update their own data" ON "${table.name}" FOR UPDATE USING (auth.uid() = ${ownerCol});`);
            policies.push(`CREATE POLICY "Users can only delete their own data" ON "${table.name}" FOR DELETE USING (auth.uid() = ${ownerCol});`);
            policies.push(`CREATE POLICY "Users can insert their own data" ON "${table.name}" FOR INSERT WITH CHECK (auth.uid() = ${ownerCol});`);
        } else {
            // 3. Fallback: Service Role only for writes if no owner found
            policies.push(`-- WARNING: No owner column found. Writes restricted to service_role only.`);
        }

        return policies;
    },

    isTenantColumn: (name: string) => TENANT_KEYS.includes(name)
};
