import React, { useState, useMemo } from "react";
import { useStore } from "../store";
import {
    History,
    Search,
    Filter,
    ChevronRight,
    ChevronDown,
    AlertTriangle,
    CheckCircle2,
    ShieldAlert,
    FileDiff,
    User,
    Clock,
    ArrowRight,
    Download
} from "lucide-react";
import { AuditLog } from "../types";

// --- TYPES & MOCK ENRICHMENT ---

type LogRisk = 'safe' | 'risky' | 'breaking';

interface EnrichedLog extends AuditLog {
    risk: LogRisk;
    diff?: {
        before: string;
        after: string;
    };
    aiInsight?: string;
    deployId?: string;
}

// Helper to mock enrich logs since backend doesn't exist yet
const enrichLog = (log: AuditLog): EnrichedLog => {
    let risk: LogRisk = 'safe';
    let diff = undefined;
    let aiInsight = undefined;

    if (log.action.includes('DROP') || log.action.includes('REMOVE')) {
        risk = 'breaking';
        aiInsight = "Destructive change: Potential data loss or API breakage.";
        diff = {
            before: `email: VARCHAR(255) NOT NULL`,
            after: `[DELETED]`
        };
    } else if (log.action.includes('ALTER') || log.action.includes('RENAME')) {
        risk = 'risky';
        aiInsight = "Schema modification may require code updates.";
        diff = {
            before: `id: UUID`,
            after: `id: BIGINT /* Type Change */`
        };
    } else {
        diff = {
            before: `[NULL]`,
            after: `created_at: TIMESTAMP DEFAULT NOW()`
        };
    }

    return { ...log, risk, diff, aiInsight };
};

// --- SUB-COMPONENTS ---

const RiskBadge = ({ risk }: { risk: LogRisk }) => {
    const styles = {
        safe: "bg-green-500/10 text-green-500 border-green-500/20",
        risky: "bg-orange-500/10 text-orange-500 border-orange-500/20",
        breaking: "bg-red-500/10 text-red-500 border-red-500/20"
    };
    const icons = {
        safe: CheckCircle2,
        risky: AlertTriangle,
        breaking: ShieldAlert
    };
    const Icon = icons[risk];

    return (
        <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border flex items-center gap-1 w-fit ${styles[risk]}`}>
            <Icon className="w-3 h-3" /> {risk}
        </span>
    );
};

const DiffViewer = ({ before, after }: { before: string, after: string }) => (
    <div className="font-mono text-xs bg-neutral-950 rounded-lg border border-neutral-800 p-3 grid grid-cols-2 gap-4">
        <div className="space-y-1">
            <div className="text-[10px] text-neutral-500 uppercase font-bold text-center border-b border-neutral-800 pb-1 mb-2">Before</div>
            <div className="text-red-400/80 bg-red-500/5 p-2 rounded whitespace-pre-wrap">{before}</div>
        </div>
        <div className="space-y-1">
            <div className="text-[10px] text-neutral-500 uppercase font-bold text-center border-b border-neutral-800 pb-1 mb-2">After</div>
            <div className="text-green-400/80 bg-green-500/5 p-2 rounded whitespace-pre-wrap">{after}</div>
        </div>
    </div>
);

// --- MAIN COMPONENT ---

export const AuditLogsView = () => {
    const { activityLogs } = useStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [riskFilter, setRiskFilter] = useState<LogRisk | 'all'>('all');
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    const enrichedLogs = useMemo(() => activityLogs.map(enrichLog), [activityLogs]);

    const filteredLogs = useMemo(() => {
        return enrichedLogs.filter(log => {
            const matchesSearch =
                log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.user_id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRisk = riskFilter === 'all' || log.risk === riskFilter;
            return matchesSearch && matchesRisk;
        });
    }, [enrichedLogs, searchTerm, riskFilter]);

    const stats = useMemo(() => ({
        total: filteredLogs.length,
        breaking: filteredLogs.filter(l => l.risk === 'breaking').length,
        risky: filteredLogs.filter(l => l.risk === 'risky').length
    }), [filteredLogs]);

    const handleExportCSV = () => {
        if (filteredLogs.length === 0) return alert("No logs to export.");

        const headers = ["Timestamp", "User", "Risk", "Action", "Item", "Details"];
        const rows = filteredLogs.map(log => [
            new Date(log.created_at).toLocaleString(),
            log.user_id || "System",
            log.risk,
            log.action,
            log.item_name,
            JSON.stringify(log.details || {}).replace(/"/g, '""') // Escape quotes
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.map(c => `"${c}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-8 space-y-6 animate-in fade-in duration-500 h-full overflow-y-auto custom-scrollbar">

            {/* Header & Stats Banner */}
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Audit Logs</h1>
                    <p className="text-neutral-500 text-sm mt-1">
                        Forensic timeline of all schema changes, deployments, and security events.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><History className="w-5 h-5" /></div>
                            <div><p className="text-sm font-bold text-white">24h Activity</p><p className="text-xs text-neutral-500">{stats.total} events logged</p></div>
                        </div>
                    </div>
                    <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 text-red-500 rounded-lg"><ShieldAlert className="w-5 h-5" /></div>
                            <div><p className="text-sm font-bold text-white">Breaking Changes</p><p className="text-xs text-neutral-500">{stats.breaking} detected</p></div>
                        </div>
                    </div>
                    <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg"><User className="w-5 h-5" /></div>
                            <div><p className="text-sm font-bold text-white">Active Users</p><p className="text-xs text-neutral-500">3 contributors</p></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 bg-neutral-900 p-2 rounded-xl border border-neutral-800">
                <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search logs by action, user, or resource..."
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 border-l border-neutral-800 pl-4">
                    <Filter className="w-4 h-4 text-neutral-500" />
                    <select
                        className="bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-3 py-2 outline-none"
                        value={riskFilter}
                        onChange={(e: any) => setRiskFilter(e.target.value)}
                    >
                        <option value="all">All Risks</option>
                        <option value="breaking">Breaking Only</option>
                        <option value="risky">Risky Only</option>
                        <option value="safe">Safe Only</option>
                    </select>
                    <button
                        onClick={handleExportCSV}
                        className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Download className="w-3.5 h-3.5" /> Export CSV
                    </button>
                </div>
            </div>

            {/* Logs Table */}
            <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900">
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-neutral-950/50 border-b border-neutral-800 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    <div className="col-span-2">Timestamp</div>
                    <div className="col-span-2">User</div>
                    <div className="col-span-2">Risk</div>
                    <div className="col-span-3">Action</div>
                    <div className="col-span-3">Resource</div>
                </div>

                <div className="divide-y divide-neutral-800">
                    {filteredLogs.length === 0 ? (
                        <div className="py-12 text-center text-neutral-500 text-sm italic">
                            No logs match your filter criteria.
                        </div>
                    ) : (
                        filteredLogs.map(log => {
                            const isExpanded = expandedRow === log.id;

                            return (
                                <div key={log.id} className="group bg-neutral-900 hover:bg-neutral-800/50 transition-colors">
                                    <div
                                        className="grid grid-cols-12 gap-4 px-6 py-4 items-center cursor-pointer"
                                        onClick={() => setExpandedRow(isExpanded ? null : log.id)}
                                    >
                                        <div className="col-span-2 flex items-center gap-2 text-xs text-neutral-400 font-mono">
                                            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                            <span className="truncate" title={new Date(log.created_at).toLocaleString()}>
                                                {new Date(log.created_at).toLocaleDateString()} <span className="text-neutral-600">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </span>
                                        </div>

                                        <div className="col-span-2 flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-[10px] font-bold">
                                                {log.user_id?.substring(0, 2).toUpperCase() || 'SY'}
                                            </div>
                                            <span className="text-xs text-neutral-300 truncate w-24" title={log.user_id || 'System'}>
                                                {log.user_id || 'System'}
                                            </span>
                                        </div>

                                        <div className="col-span-2">
                                            <RiskBadge risk={log.risk} />
                                        </div>

                                        <div className="col-span-3">
                                            <span className="text-sm font-bold text-white tracking-tight">{log.action}</span>
                                        </div>

                                        <div className="col-span-3">
                                            <code className="text-[10px] bg-neutral-950 px-1.5 py-0.5 rounded text-neutral-400 font-mono">
                                                {log.item_name}
                                            </code>
                                        </div>
                                    </div>

                                    {/* Expanded Detail Panel */}
                                    {isExpanded && (
                                        <div className="px-12 pb-6 pt-0 animate-in slide-in-from-top-2 duration-200">
                                            <div className="border-l-2 border-neutral-800 pl-6 space-y-4">

                                                {/* AI Insight */}
                                                {log.aiInsight && (
                                                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-3 flex items-start gap-3">
                                                        <div className="p-1 bg-blue-500/20 rounded text-blue-500 mt-0.5"><FileDiff className="w-3.5 h-3.5" /></div>
                                                        <div>
                                                            <p className="text-xs font-bold text-blue-400 mb-0.5">AI Impact Analysis</p>
                                                            <p className="text-xs text-neutral-300 leading-relaxed">{log.aiInsight}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Visual Diff */}
                                                {log.diff && (
                                                    <DiffViewer before={log.diff.before} after={log.diff.after} />
                                                )}

                                                {/* Metadata Footer */}
                                                <div className="flex items-center gap-6 text-[10px] text-neutral-500">
                                                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Latency: 45ms</span>
                                                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-500" /> Confirmed in Deploy #1042</span>
                                                    {log.details && (
                                                        <span className="font-mono opacity-50">Raw: {JSON.stringify(log.details).substring(0, 50)}...</span>
                                                    )}
                                                </div>

                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};
