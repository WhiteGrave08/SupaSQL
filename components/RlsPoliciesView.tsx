import React, { useMemo } from "react";
import { useStore } from "../store";
import { SafetyEngine, RiskLevel, AccessScope, DeployStatus } from "../lib/safety-engine";
import {
    ShieldAlert,
    ShieldCheck,
    Lock,
    Globe,
    Users,
    Server,
    AlertTriangle,
    CheckCircle2,
    ChevronRight,
    BrainCircuit,
    Plus,
    X,
    Sparkles
} from "lucide-react";

// --- SUB-COMPONENTS ---

const RiskBadge = ({ level }: { level: RiskLevel }) => {
    const styles = {
        critical: "bg-red-500/10 text-red-500 border-red-500/20",
        high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
        medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        low: "bg-green-500/10 text-green-500 border-green-500/20",
    };

    return (
        <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border ${styles[level]}`}>
            {level}
        </span>
    );
};

const AccessScopeLabel = ({ scope }: { scope: AccessScope }) => {
    const icons = {
        public: <Globe className="w-3 h-3" />,
        authenticated: <Users className="w-3 h-3" />,
        service_role: <Server className="w-3 h-3" />,
        private: <Lock className="w-3 h-3" />,
    };

    const labels = {
        public: "Public (Anon)",
        authenticated: "Auth Only",
        service_role: "Service Role",
        private: "Private (Owner)",
    };

    return (
        <div className={`flex items-center gap-1.5 text-xs font-medium ${scope === 'public' ? 'text-red-400' : 'text-neutral-400'}`}>
            {icons[scope]}
            <span>{labels[scope]}</span>
        </div>
    );
};

const DeployStatusBadge = ({ status }: { status: DeployStatus }) => {
    if (status === 'safe') return (
        <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold uppercase">
            <CheckCircle2 className="w-3 h-3" /> Safe
        </div>
    );

    return (
        <div className={`flex items-center gap-1 text-[10px] font-bold uppercase ${status === 'blocked' ? 'text-red-500' : 'text-orange-500'}`}>
            {status === 'blocked' ? <ShieldAlert className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
            {status === 'blocked' ? 'Blocks Deploy' : 'Warns on Deploy'}
        </div>
    );
};

// --- MAIN COMPONENT ---

export const RlsPoliciesView = () => {
    const { currentSchema } = useStore();
    const [activeTable, setActiveTable] = React.useState<any>(null);
    const [generatedPolicies, setGeneratedPolicies] = React.useState<Record<string, string[]>>({});

    const handleAutoGenerate = async () => {
        const { currentSchema, updateTable, saveSchema } = useStore.getState();
        let appliedCount = 0;

        // Generate policies for ALL tables that don't have them
        if (currentSchema?.tables) {
            currentSchema.tables.forEach(table => {
                if (!table.policies || table.policies.length === 0) {
                    const policies = SafetyEngine.generateSuggestedPolicies(table);
                    updateTable(table.id, { policies });
                    appliedCount++;
                }
            });
        }

        if (appliedCount > 0) {
            try {
                // Save locally first
                await saveSchema();
                alert(`Auto-generated policies for ${appliedCount} tables.`);
            } catch (err) {
                console.error("Failed to save schema:", err);
                // Even if remote save fails, the local store is updated
                alert(`Policies generated for ${appliedCount} tables. (Note: Remote save failed, but changes are active locally)`);
            }
        } else {
            alert("All tables already have policies.");
        }
    };

    // Run Analysis on all tables
    const analysis = useMemo(() => {
        if (!currentSchema?.tables) return [];
        return currentSchema.tables.map(table => {
            const stats = SafetyEngine.analyzeTable(table, currentSchema.relationships || []);
            return { table, ...stats };
        }).sort((a, b) => {
            // Sort Critical -> Low
            const order = { critical: 0, high: 1, medium: 2, low: 3 };
            return order[a.risk] - order[b.risk];
        });
    }, [currentSchema]);

    const globalStatus = useMemo(() => {
        const criticalCount = analysis.filter(a => a.risk === 'critical').length;
        const highCount = analysis.filter(a => a.risk === 'high').length;

        if (criticalCount > 0) return {
            status: 'High Risk',
            color: 'text-red-500',
            bg: 'bg-red-500/10 border-red-500/20',
            icon: ShieldAlert,
            msg: `${criticalCount} tables publicly exposed. Deployment is blocked.`
        };
        if (highCount > 0) return {
            status: 'Elevated Risk',
            color: 'text-orange-500',
            bg: 'bg-orange-500/10 border-orange-500/20',
            icon: AlertTriangle,
            msg: `${highCount} tables need review before deploy.`
        };
        return {
            status: 'Secure',
            color: 'text-green-500',
            bg: 'bg-green-500/10 border-green-500/20',
            icon: ShieldCheck,
            msg: "All tables protected. Ready for production."
        };
    }, [analysis]);

    const StatusIcon = globalStatus.icon;

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500 h-full overflow-y-auto custom-scrollbar">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Security Decision Center</h1>
                <p className="text-neutral-500 text-sm mt-1">
                    Review access controls and mitigate deployment risks.
                </p>
            </div>

            {/* Global Status Banner */}
            <div className={`p-6 rounded-2xl border ${globalStatus.bg} flex items-start gap-4`}>
                <div className={`p-3 rounded-xl bg-neutral-950/20 ${globalStatus.color}`}>
                    <StatusIcon className="w-8 h-8" />
                </div>
                <div>
                    <h2 className={`text-lg font-bold ${globalStatus.color} mb-1`}>
                        Security Status: {globalStatus.status}
                    </h2>
                    <p className="text-sm text-neutral-300">
                        {globalStatus.msg}
                    </p>
                    {analysis.filter(a => a.risk === 'critical').length > 0 && (
                        <div className="mt-4 flex gap-3">
                            <button className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-red-500/20">
                                Fix Critical Issues safely
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Table List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                            Table Security ({analysis.length})
                        </h3>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1.5 text-[10px] text-neutral-500">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div> Critical
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] text-neutral-500">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div> Safe
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {analysis.map(({ table, risk, accessScope, deployStatus, reasons }) => (
                            <div
                                key={table.id}
                                className="group p-4 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl transition-all"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-neutral-800 rounded-lg">
                                            <Lock className={`w-4 h-4 ${risk === 'critical' ? 'text-red-500' : 'text-neutral-400'}`} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                                {table.name}
                                                <RiskBadge level={risk} />
                                            </h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <AccessScopeLabel scope={accessScope} />
                                                <span className="text-neutral-700">•</span>
                                                <DeployStatusBadge status={deployStatus} />
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setActiveTable(table);
                                        }}
                                        className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-lg transition-colors"
                                    >
                                        Manage
                                    </button>
                                </div>

                                {/* AI / Risk Rationale */}
                                {(reasons.length > 0) && (
                                    <div className="mt-3 pl-11">
                                        <div className="text-[11px] text-neutral-400 bg-neutral-950/50 p-2 rounded-lg border border-neutral-800/50 flex flex-col gap-1">
                                            {reasons.map((r, i) => (
                                                <div key={i} className="flex items-start gap-2">
                                                    <AlertTriangle className="w-3 h-3 text-orange-500 shrink-0 mt-0.5" />
                                                    <span>{r}</span>
                                                </div>
                                            ))}
                                            {risk === 'critical' && (
                                                <div className="pt-2 mt-1 border-t border-neutral-800 flex gap-2">
                                                    <button className="flex-1 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded border border-blue-500/20 transition-colors flex items-center justify-center gap-1">
                                                        <Plus className="w-3 h-3" /> Add Owner Policy
                                                    </button>
                                                    <button className="flex-1 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 text-[10px] font-bold rounded border border-neutral-700 transition-colors">
                                                        Make Private
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: AI Security Review */}
                <div className="space-y-6">
                    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <BrainCircuit className="w-32 h-32 text-blue-500" />
                        </div>

                        <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4" /> AI Security Review
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0 animate-pulse"></div>
                                <div>
                                    <p className="text-sm font-bold text-white">PII Exposure Detected</p>
                                    <p className="text-xs text-neutral-500 mt-1">
                                        Tables <code className="text-white bg-neutral-800 px-1 rounded">users</code> contains 'email' but is publicly accessible.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0"></div>
                                <div>
                                    <p className="text-sm font-bold text-white">Missing Tenant Isolation</p>
                                    <p className="text-xs text-neutral-500 mt-1">
                                        Multiple tables lack <code className="text-white bg-neutral-800 px-1 rounded">org_id</code> foreign keys, posing a data leak risk in multi-tenant setup.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAutoGenerate}
                            className="w-full mt-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Sparkles className="w-3.5 h-3.5" /> Auto-Generate Policies
                        </button>
                    </div>

                    <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl">
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">
                            Compliance Checklist
                        </h3>
                        <div className="space-y-2">
                            <div className="group relative flex items-center justify-between text-xs p-2 bg-neutral-950 rounded-lg border border-neutral-800 cursor-help">
                                <span className="text-neutral-400 border-b border-dotted border-neutral-700">SOC 2 (Access Control)</span>
                                <span className="text-red-500 font-bold">Failing</span>
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-neutral-800 text-neutral-300 text-[10px] rounded-lg border border-neutral-700 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    <strong>Failure Reason:</strong> Public access detected on PII tables. SOC 2 requires "Need-to-Know" access restrictions for sensitive data.
                                </div>
                            </div>
                            <div className="group relative flex items-center justify-between text-xs p-2 bg-neutral-950 rounded-lg border border-neutral-800 cursor-help">
                                <span className="text-neutral-400 border-b border-dotted border-neutral-700">GDPR (Data Privacy)</span>
                                <span className="text-orange-500 font-bold">Warning</span>
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-neutral-800 text-neutral-300 text-[10px] rounded-lg border border-neutral-700 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    <strong>Warning:</strong> Potential PII exposure without Row Level Security. Ensure users can only access their own records (Article 32).
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Policy Editor Modal */}
            {activeTable && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-blue-500" />
                                <h3 className="font-bold text-white">Manage RLS Policies: {activeTable.name}</h3>
                            </div>
                            <button onClick={() => setActiveTable(null)} className="text-neutral-500 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Active Policies</label>
                                <div className="h-48 bg-black/50 border border-neutral-800 rounded-lg p-3 font-mono text-xs text-neutral-300 overflow-y-auto">
                                    {generatedPolicies[activeTable.id] ? (
                                        <pre className="whitespace-pre-wrap">{generatedPolicies[activeTable.id].join('\n\n')}</pre>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-neutral-600 italic">
                                            <p>No active policies found.</p>
                                            <button
                                                onClick={() => {
                                                    const suggestions = SafetyEngine.generateSuggestedPolicies(activeTable);
                                                    setGeneratedPolicies(prev => ({ ...prev, [activeTable.id]: suggestions }));
                                                }}
                                                className="mt-2 text-blue-500 hover:underline not-italic font-bold"
                                            >
                                                Generate Suggested Policies
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-neutral-800 bg-neutral-900/50 flex justify-end gap-3">
                            <button onClick={() => setActiveTable(null)} className="px-4 py-2 text-xs font-bold text-neutral-400 hover:text-white transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (generatedPolicies[activeTable.id]) {
                                        useStore.getState().updateTable(activeTable.id, {
                                            policies: generatedPolicies[activeTable.id]
                                        });
                                        useStore.getState().saveSchema();
                                        alert("Policies applied to schema and visible in Code View.");
                                    }
                                    setActiveTable(null);
                                }}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors"
                            >
                                Save & Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
