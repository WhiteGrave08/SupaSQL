import React, { useState } from "react";
import { useStore } from "../store";
import { Loader2, ShieldAlert, Sparkles, Lock } from "lucide-react";

export const SettingsModal = () => {
    const { isSettingsOpen, setSettingsOpen } = useStore();
    const [activeTab, setActiveTab] = useState("General");
    const [isSaving, setIsSaving] = useState(false);

    if (!isSettingsOpen) return null;

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setSettingsOpen(false);
            alert("Settings saved successfully!");
        }, 800);
    };

    const tabs = [
        { id: "General", label: "General" },
        { id: "Schema & Deploy", label: "Schema & Deploy" },
        { id: "Security & Access", label: "Security & Access" },
        { id: "API Keys", label: "API Keys" },
        { id: "Billing", label: "Billing" },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 delay-100 animate-in fade-in duration-200">
            <div className="bg-neutral-900 border border-neutral-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-neutral-800 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-white">Project Settings</h2>
                        <p className="text-xs text-neutral-500 mt-1">
                            Configure schema behavior, deployment rules, and security policies.
                        </p>
                    </div>
                    <button
                        onClick={() => setSettingsOpen(false)}
                        className="p-2 hover:bg-neutral-800 rounded-md text-neutral-400 hover:text-white"
                    >
                        ×
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-64 bg-neutral-950/50 border-r border-neutral-800 p-4 space-y-1 shrink-0 overflow-y-auto">
                        {tabs.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                className={`w-full text-left px-3 py-2 rounded-md text-xs font-bold transition-colors ${activeTab === t.id
                                        ? "bg-neutral-800 text-white"
                                        : "text-neutral-500 hover:text-white hover:bg-neutral-800/50"
                                    }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                        {activeTab === "General" && (
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-2">
                                        Project Identity
                                    </h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-neutral-500 uppercase">
                                                Project Name
                                            </label>
                                            <input
                                                className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                                                defaultValue="SupaSQL Production"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-neutral-500 uppercase">
                                                Environment Type
                                            </label>
                                            <select className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm text-white outline-none">
                                                <option>Production (Strict)</option>
                                                <option>Staging</option>
                                                <option>Development</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-2">
                                        Configuration
                                    </h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-neutral-500 uppercase">
                                                Default Branch
                                            </label>
                                            <select className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm text-white outline-none">
                                                <option>main</option>
                                                <option>develop</option>
                                                <option>master</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-neutral-500 uppercase">
                                                System Timezone
                                            </label>
                                            <select className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm text-white outline-none">
                                                <option>UTC (Coordinated Universal Time)</option>
                                                <option>EST (Eastern Standard Time)</option>
                                                <option>PST (Pacific Standard Time)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "Schema & Deploy" && (
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-2">
                                        Target Architecture
                                    </h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-neutral-500 uppercase">
                                                Database Engine
                                            </label>
                                            <select className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm text-white outline-none">
                                                <option>PostgreSQL 16 (Recommended)</option>
                                                <option>PostgreSQL 15</option>
                                                <option>MySQL 8.0</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-neutral-500 uppercase">
                                                Migration Strategy
                                            </label>
                                            <select className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm text-white outline-none">
                                                <option>Manual Approval (Safer)</option>
                                                <option>Auto-Generate & Apply</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-2">
                                        Safety Guardrails
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-neutral-950 border border-neutral-800 rounded-lg">
                                            <div>
                                                <p className="text-sm font-bold text-white">
                                                    Block Breaking Changes
                                                </p>
                                                <p className="text-xs text-neutral-500">
                                                    Prevent destructive actions (DROP, etc.) on this
                                                    environment.
                                                </p>
                                            </div>
                                            <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                                                <div className="w-3 h-3 bg-white rounded-full absolute top-1 right-1"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-neutral-950 border border-neutral-800 rounded-lg">
                                            <div>
                                                <p className="text-sm font-bold text-white">
                                                    Require Deployment Reviews
                                                </p>
                                                <p className="text-xs text-neutral-500">
                                                    Mandate team approval before applying changes.
                                                </p>
                                            </div>
                                            <div className="w-10 h-5 bg-neutral-700 rounded-full relative cursor-pointer">
                                                <div className="w-3 h-3 bg-white rounded-full absolute top-1 left-1"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-neutral-950 border border-neutral-800 rounded-lg">
                                            <div>
                                                <p className="text-sm font-bold text-white flex items-center gap-2">
                                                    <Sparkles className="w-3 h-3 text-purple-400" /> AI
                                                    Risk Assessment
                                                </p>
                                                <p className="text-xs text-neutral-500">
                                                    Require AI safety check pass before deployment.
                                                </p>
                                            </div>
                                            <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                                                <div className="w-3 h-3 bg-white rounded-full absolute top-1 right-1"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "Security & Access" && (
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-2">
                                        Access Control
                                    </h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-neutral-500 uppercase">
                                                Schema Edit Permissions
                                            </label>
                                            <select className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm text-white outline-none">
                                                <option>Admins & Editors</option>
                                                <option>Admins Only</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-neutral-500 uppercase">
                                                Deployment Authority
                                            </label>
                                            <select className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm text-white outline-none">
                                                <option>Admins Only</option>
                                                <option>Admins & Lead Devs</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-2">
                                        Policy Enforcement
                                    </h3>
                                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl space-y-3">
                                        <div className="flex items-start gap-3">
                                            <ShieldAlert className="w-5 h-5 text-orange-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-bold text-white">
                                                    RLS Coverage Requirement
                                                </p>
                                                <p className="text-xs text-neutral-400 mt-1">
                                                    Determine how the system handles tables without RLS
                                                    policies.
                                                </p>
                                            </div>
                                        </div>
                                        <select className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-sm text-white outline-none">
                                            <option>Warn (Allow Deployment)</option>
                                            <option>Block Deployment (Strict)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {(activeTab === "API Keys" || activeTab === "Billing") && (
                            <div className="flex flex-col items-center justify-center h-48 text-neutral-500">
                                <Lock className="w-8 h-8 mb-2 opacity-50" />
                                <p className="text-sm">Sensitive settings are managed externally.</p>
                                <button className="mt-4 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-md">
                                    Manage in Supabase Dashboard
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-neutral-800 flex justify-end gap-3 shrink-0 bg-neutral-900">
                    <button
                        onClick={() => setSettingsOpen(false)}
                        className="px-4 py-2 text-xs font-bold text-neutral-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-md transition-colors flex items-center gap-2"
                    >
                        {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};
