import React from "react";
import { Link } from "react-router-dom";
import {
    ShieldAlert,
    FileCode,
    Layout,
    History,
    ArrowRight,
    Database,
    Lock,
    Zap,
    CheckCircle2,
    ChevronRight,
} from "lucide-react";

export const LandingHome = () => {
    return (
        <div className="animate-in fade-in duration-700">
            {/* 1. HERO SECTION */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
                <div className="max-w-[1200px] mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-wider mb-8 animate-in slide-in-from-bottom-4 duration-700 delay-100">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Schema Decision Control
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 animate-in slide-in-from-bottom-4 duration-700 delay-200">
                        Design, secure, and deploy <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                            database schemas
                        </span>{" "}
                        with confidence.
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-10 animate-in slide-in-from-bottom-4 duration-700 delay-300">
                        SupaSQL helps teams visually design schemas, enforce Row Level
                        Security, generate verified SQL, and audit every change.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in slide-in-from-bottom-4 duration-700 delay-500">
                        <Link
                            to="/signup"
                            className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition-all shadow-xl shadow-white/10 flex items-center gap-2 w-full md:w-auto justify-center"
                        >
                            Start building <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            to="#"
                            className="px-8 py-4 bg-neutral-900 border border-neutral-800 text-white font-bold rounded-lg hover:bg-neutral-800 transition-all w-full md:w-auto justify-center text-center"
                        >
                            View demo schema
                        </Link>
                    </div>
                </div>

                {/* Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none opacity-50"></div>
            </section>

            {/* 2. PROBLEM SECTION */}
            <section className="py-24 bg-neutral-950/50 border-y border-neutral-800/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Database schemas break production.
                        </h2>
                        <p className="text-neutral-500">
                            Most teams manage schemas with raw SQL files or UI tools that lack
                            governance.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 bg-neutral-900/50 border border-neutral-800 rounded-2xl hover:border-red-500/30 transition-colors group">
                            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-colors">
                                <Lock className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                Unprotected Data
                            </h3>
                            <p className="text-neutral-500 leading-relaxed">
                                Tables created without RLS policies expose sensitive user data
                                by default.
                            </p>
                        </div>
                        <div className="p-8 bg-neutral-900/50 border border-neutral-800 rounded-2xl hover:border-orange-500/30 transition-colors group">
                            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                                <Database className="w-6 h-6 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                Breaking Changes
                            </h3>
                            <p className="text-neutral-500 leading-relaxed">
                                Dropping columns or changing types breaks downstream application
                                code silently.
                            </p>
                        </div>
                        <div className="p-8 bg-neutral-900/50 border border-neutral-800 rounded-2xl hover:border-purple-500/30 transition-colors group">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                                <History className="w-6 h-6 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                Mystery Updates
                            </h3>
                            <p className="text-neutral-500 leading-relaxed">
                                "Who added that index?" Without audit logs, you're debugging
                                blind.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. CORE CAPABILITIES */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6 space-y-24">
                    {/* Feature 1 */}
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-800 rounded-full text-neutral-400 text-xs font-bold uppercase tracking-wider">
                                <Layout className="w-3 h-3" /> Visual Editor
                            </div>
                            <h2 className="text-4xl font-bold text-white">
                                Design schemas without the headache.
                            </h2>
                            <p className="text-lg text-neutral-500 leading-relaxed">
                                Define tables, relationships, and constraints visually. SupaSQL
                                handles the foreign keys and type mapping automatically.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-neutral-300">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" /> Drag & Drop
                                    relationships
                                </li>
                                <li className="flex items-center gap-3 text-neutral-300">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" /> Type-safe
                                    column definitions
                                </li>
                                <li className="flex items-center gap-3 text-neutral-300">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" /> Auto-generated
                                    indexes
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-2 shadow-2xl skew-y-1 transform transition-transform hover:skew-y-0 duration-500">
                            <div className="bg-neutral-950 rounded-xl border border-neutral-800 aspect-video flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
                                <Layout className="w-20 h-20 text-neutral-800" />
                                {/* Placeholder for Screenshot */}
                                <div className="absolute bottom-4 left-4 right-4 h-12 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center px-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2 (Reversed) */}
                    <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-800 rounded-full text-neutral-400 text-xs font-bold uppercase tracking-wider">
                                <ShieldAlert className="w-3 h-3" /> Security First
                            </div>
                            <h2 className="text-4xl font-bold text-white">
                                Enforce security by default.
                            </h2>
                            <p className="text-lg text-neutral-500 leading-relaxed">
                                See unprotected tables instantly in your health dashboard. Generate
                                and attach RLS policies before you deploy.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-neutral-300">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" /> RLS
                                    coverage monitoring
                                </li>
                                <li className="flex items-center gap-3 text-neutral-300">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" /> Policy
                                    generation templates
                                </li>
                                <li className="flex items-center gap-3 text-neutral-300">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" /> Risk
                                    classification
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-2 shadow-2xl -skew-y-1 transform transition-transform hover:skew-y-0 duration-500">
                            <div className="bg-neutral-950 rounded-xl border border-neutral-800 aspect-video flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-bl from-red-500/10 to-transparent"></div>
                                <ShieldAlert className="w-20 h-20 text-neutral-800" />
                            </div>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-800 rounded-full text-neutral-400 text-xs font-bold uppercase tracking-wider">
                                <History className="w-3 h-3" /> Audit Logs
                            </div>
                            <h2 className="text-4xl font-bold text-white">
                                Track every schema change.
                            </h2>
                            <p className="text-lg text-neutral-500 leading-relaxed">
                                Enterprise-grade accountability for your database. Know exactly
                                who deployed a change, when, and why.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-neutral-300">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" /> Timestamped
                                    change feed
                                </li>
                                <li className="flex items-center gap-3 text-neutral-300">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" /> Before/After
                                    diff viewing
                                </li>
                                <li className="flex items-center gap-3 text-neutral-300">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" /> Team member
                                    attribution
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-2 shadow-2xl skew-y-1 transform transition-transform hover:skew-y-0 duration-500">
                            <div className="bg-neutral-950 rounded-xl border border-neutral-800 aspect-video flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent"></div>
                                <History className="w-20 h-20 text-neutral-800" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. HOW IT WORKS */}
            <section className="py-24 bg-neutral-900/30 border-y border-neutral-800">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-white mb-16">
                        Everything you need to ship faster.
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mx-auto text-xl font-bold text-white border border-neutral-700">
                                1
                            </div>
                            <h3 className="font-bold text-white">Create Project</h3>
                            <p className="text-sm text-neutral-500">
                                Start a fresh schema or import existing SQL.
                            </p>
                        </div>
                        <div className="hidden md:block pt-6">
                            <div className="h-px bg-neutral-800 w-full"></div>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mx-auto text-xl font-bold text-white border border-neutral-700">
                                2
                            </div>
                            <h3 className="font-bold text-white">Design Visually</h3>
                            <p className="text-sm text-neutral-500">
                                Map out tables and relationships.
                            </p>
                        </div>
                        <div className="hidden md:block pt-6">
                            <div className="h-px bg-neutral-800 w-full"></div>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mx-auto text-xl font-bold text-white border border-neutral-700">
                                3
                            </div>
                            <h3 className="font-bold text-white">Review & Secure</h3>
                            <p className="text-sm text-neutral-500">
                                Apply RLS policies and check health.
                            </p>
                        </div>
                        <div className="hidden md:block pt-6">
                            <div className="h-px bg-neutral-800 w-full"></div>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold text-white shadow-lg shadow-blue-500/20">
                                4
                            </div>
                            <h3 className="font-bold text-white">Deploy</h3>
                            <p className="text-sm text-neutral-500">
                                Push verified SQL to production.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. CTA */}
            <section className="py-32 px-6 text-center">
                <h2 className="text-4xl font-bold text-white mb-6">
                    Stop guessing. <br />
                    Start deploying schemas with confidence.
                </h2>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <Link
                        to="/signup"
                        className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                    >
                        Start for free
                    </Link>
                    <Link
                        to="/login"
                        className="px-8 py-4 bg-neutral-900 text-neutral-300 font-bold rounded-lg hover:text-white hover:bg-neutral-800 transition-all"
                    >
                        Sign in
                    </Link>
                </div>
            </section>
        </div>
    );
};
