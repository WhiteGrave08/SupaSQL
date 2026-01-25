import React from "react";
import { Link } from "react-router-dom";
import {
    Database,
    ShieldCheck,
    GitBranch,
    Layers,
    Code2,
    Server,
    Ban,
    CheckCircle2,
    Cpu,
    Fingerprint,
} from "lucide-react";

export const LandingProduct = () => {
    return (
        <div className="animate-in fade-in duration-700">
            {/* 1. HERO: PHILOSOPHY */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-bold uppercase tracking-wider mb-8">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        The Philosophy
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8">
                        The <span className="text-purple-500">Schema-First</span> <br />
                        Standard.
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                        SupaSQL is not just a tool; it's a methodology. We believe your
                        database schema is the most critical contract in your system, yet it
                        lacks the governance of application code. <br />
                        <span className="text-white font-medium">We're fixing that.</span>
                    </p>
                </div>
                {/* Abstract Grid Background */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/20 blur-[100px] rounded-full pointer-events-none"></div>
            </section>

            {/* 2. THE THREE PILLARS (BENTO GRID) */}
            <section className="py-24 px-6 border-y border-neutral-800 bg-neutral-900/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white">
                            Why we built SupaSQL.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
                        {/* Card 1: Visual Design */}
                        <div className="md:col-span-2 p-8 bg-neutral-900 border border-neutral-800 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Layers className="w-48 h-48 text-blue-500" />
                            </div>
                            <div className="relative z-10 h-full flex flex-col justify-end">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                                    <Layers className="w-6 h-6 text-blue-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Visual Clarity
                                </h3>
                                <p className="text-neutral-400 text-lg">
                                    SQL is powerful, but hard to visualize. We turn thousands of
                                    lines of DDL into an interactive map, making it impossible to
                                    miss a missing index or a circular dependency.
                                </p>
                            </div>
                        </div>

                        {/* Card 2: Security */}
                        <div className="md:col-span-1 p-8 bg-neutral-900 border border-neutral-800 rounded-2xl relative overflow-hidden group">
                            <div className="relative z-10 h-full flex flex-col justify-end">
                                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
                                    <ShieldCheck className="w-6 h-6 text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Security at Route 0
                                </h3>
                                <p className="text-neutral-400">
                                    We don't just warn you about RLS; we block deployments that
                                    leave tables exposed. Security isn't an afterthought.
                                </p>
                            </div>
                        </div>

                        {/* Card 3: Governance */}
                        <div className="md:col-span-1 p-8 bg-neutral-900 border border-neutral-800 rounded-2xl relative overflow-hidden group">
                            <div className="relative z-10 h-full flex flex-col justify-end">
                                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6">
                                    <GitBranch className="w-6 h-6 text-orange-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Git-like Control
                                </h3>
                                <p className="text-neutral-400">
                                    Branch, diff, review, and merge your schema changes just like
                                    you do with your application code.
                                </p>
                            </div>
                        </div>

                        {/* Card 4: Intelligence */}
                        <div className="md:col-span-2 p-8 bg-neutral-900 border border-neutral-800 rounded-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10 h-full flex flex-col justify-end">
                                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                                    <Cpu className="w-6 h-6 text-purple-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    The Safety Engine
                                </h3>
                                <p className="text-neutral-400 text-lg">
                                    Our proprietary analysis engine runs 50+ checks against your
                                    proposed changes. It catches performance killers, lock
                                    contention risks, and destructive operations before they ever
                                    touch production.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. DIFFERENTIATION (What we are NOT) */}
            <section className="py-24 px-6 bg-neutral-950">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white">
                            Know what you're buying.
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="flex items-start gap-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                <Server className="w-8 h-8 text-neutral-500 shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-300 mb-1">
                                        We are NOT a Hosting Provider
                                    </h3>
                                    <p className="text-neutral-500">
                                        We don't host your data. We connect to your existing
                                        Supabase, AWS RDS, or Railway database. Your data stays
                                        with you.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                <Code2 className="w-8 h-8 text-neutral-500 shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-300 mb-1">
                                        We are NOT an ORM
                                    </h3>
                                    <p className="text-neutral-500">
                                        We don't replace Prisma or Drizzle. We help you design the
                                        schema that those ORMs ingest.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                <Ban className="w-8 h-8 text-neutral-500 shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-300 mb-1">
                                        We are NOT "Magic AI"
                                    </h3>
                                    <p className="text-neutral-500">
                                        We use AI to explain risks, not to hallucinate your database
                                        structure. Deterministic safety is our priority.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Visual Representation of "Control Plane" */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 relative">
                            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-20"></div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-center p-4 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-400 text-sm font-mono">
                                    Your Application Code
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="h-8 w-px bg-neutral-700"></div>
                                    <div className="px-6 py-3 bg-blue-600 rounded-xl text-white font-bold shadow-2xl shadow-blue-500/20 z-10">
                                        SupaSQL Control Plane
                                    </div>
                                    <div className="h-8 w-px bg-neutral-700"></div>
                                </div>
                                <div className="flex items-center justify-center p-4 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-400 text-sm font-mono">
                                    Your Production Database
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. TECH SPECS */}
            <section className="py-24 px-6 border-t border-neutral-800">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="text-center md:text-left">
                        <h4 className="text-neutral-500 text-sm font-bold uppercase tracking-wider mb-4">Supported Engines</h4>
                        <ul className="space-y-2 text-neutral-300 font-medium">
                            <li>PostgreSQL 16</li>
                            <li>PostgreSQL 15</li>
                            <li>Supabase (Native)</li>
                            <li>MySQL 8.0 (Beta)</li>
                        </ul>
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="text-neutral-500 text-sm font-bold uppercase tracking-wider mb-4">Export Formats</h4>
                        <ul className="space-y-2 text-neutral-300 font-medium">
                            <li>Raw SQL (.sql)</li>
                            <li>TypeScript Types (.ts)</li>
                            <li>JSON Schema</li>
                            <li>Prisma Schema</li>
                        </ul>
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="text-neutral-500 text-sm font-bold uppercase tracking-wider mb-4">Security Standards</h4>
                        <ul className="space-y-2 text-neutral-300 font-medium">
                            <li>SOC2 Compliant Logs</li>
                            <li>Role-Based Access</li>
                            <li>MFA Enforcement</li>
                            <li>Encrypted at Rest</li>
                        </ul>
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="text-neutral-500 text-sm font-bold uppercase tracking-wider mb-4">Integrations</h4>
                        <ul className="space-y-2 text-neutral-300 font-medium">
                            <li>GitHub Actions</li>
                            <li>GitLab CI</li>
                            <li>Vercel Deploy</li>
                            <li>Slack Alerts</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 5. CTA via Identity */}
            <section className="py-32 px-6 text-center bg-neutral-900 border-t border-neutral-800">
                <Fingerprint className="w-16 h-16 text-purple-500 mx-auto mb-6" />
                <h2 className="text-4xl font-bold text-white mb-6">
                    Ready to professionalize your workflow?
                </h2>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <Link
                        to="/signup"
                        className="px-8 py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/20"
                    >
                        Create Free Account
                    </Link>
                    <Link
                        to="/contact"
                        className="px-8 py-4 bg-transparent border border-neutral-700 text-neutral-300 font-bold rounded-lg hover:text-white hover:bg-neutral-800 transition-all"
                    >
                        Talk to Sales
                    </Link>
                </div>
            </section>
        </div>
    );
};
