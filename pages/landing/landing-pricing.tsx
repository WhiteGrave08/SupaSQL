import React from "react";
import { Link } from "react-router-dom";
import { Check, X, HelpCircle, Zap, Shield, Building2 } from "lucide-react";

export const LandingPricing = () => {
    return (
        <div className="animate-in fade-in duration-700">
            {/* 1. HERO */}
            <section className="pt-32 pb-20 px-6 text-center">
                <h1 className="text-5xl font-bold text-white mb-6">
                    Simple, transparent pricing.
                </h1>
                <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                    Start designing securely for free. Upgrade for team governance and
                    audit logs.
                </p>
            </section>

            {/* 2. PRICING CARDS */}
            <section className="pb-32 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* FREE TIER */}
                    <div className="p-8 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col hover:border-neutral-700 transition-colors">
                        <div className="mb-8">
                            <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center mb-6">
                                <Zap className="w-6 h-6 text-neutral-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Developer</h3>
                            <p className="text-neutral-500 text-sm mt-2 h-10">
                                For solo developers building side projects.
                            </p>
                            <div className="mt-6 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">$0</span>
                                <span className="text-neutral-500">/mo</span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 mb-8">
                            <div className="flex items-center gap-3 text-sm text-neutral-300">
                                <Check className="w-4 h-4 text-blue-500 shrink-0" />
                                <span>1 Project</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-neutral-300">
                                <Check className="w-4 h-4 text-blue-500 shrink-0" />
                                <span>Unlimited Tables</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-neutral-300">
                                <Check className="w-4 h-4 text-blue-500 shrink-0" />
                                <span>Visual Schema Editor</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-neutral-300">
                                <Check className="w-4 h-4 text-blue-500 shrink-0" />
                                <span>SQL & Type Export</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-neutral-600">
                                <X className="w-4 h-4 shrink-0" />
                                <span>No Audit Logs</span>
                            </div>
                        </div>

                        <Link
                            to="/signup"
                            className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white text-center font-bold rounded-lg transition-colors"
                        >
                            Start Free
                        </Link>
                    </div>

                    {/* PRO TIER (POPULAR) */}
                    <div className="p-8 bg-neutral-900/80 border border-blue-500/30 rounded-2xl flex flex-col relative overflow-hidden shadow-2xl shadow-blue-900/20 md:-mt-8 md:mb-8 scale-105 z-10">
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
                        <div className="absolute top-4 right-4 px-3 py-1 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                            Most Popular
                        </div>

                        <div className="mb-8">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                                <Shield className="w-6 h-6 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Team</h3>
                            <p className="text-neutral-500 text-sm mt-2 h-10">
                                For growing teams that need security & logs.
                            </p>
                            <div className="mt-6 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">$29</span>
                                <span className="text-neutral-500">/mo per user</span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 mb-8">
                            <div className="flex items-center gap-3 text-sm text-white font-medium">
                                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                                <span>Unlimited Projects</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-white font-medium">
                                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                                <span>RLS Management</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-white font-medium">
                                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                                <span>Audit Logs (30 Days)</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-white font-medium">
                                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                                <span>Schema Health Checks</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-white font-medium">
                                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                                <span>Team Collaboration</span>
                            </div>
                        </div>

                        <Link
                            to="/signup?plan=pro"
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-center font-bold rounded-lg transition-colors shadow-lg shadow-blue-500/25"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* ENTERPRISE TIER */}
                    <div className="p-8 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col hover:border-neutral-700 transition-colors">
                        <div className="mb-8">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                                <Building2 className="w-6 h-6 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Enterprise</h3>
                            <p className="text-neutral-500 text-sm mt-2 h-10">
                                For organizations requiring strict governance.
                            </p>
                            <div className="mt-6 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">Custom</span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 mb-8">
                            <div className="flex items-center gap-3 text-sm text-neutral-300">
                                <Check className="w-4 h-4 text-purple-500 shrink-0" />
                                <span>SSO & SAML</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-neutral-300">
                                <Check className="w-4 h-4 text-purple-500 shrink-0" />
                                <span>Unlimited Audit History</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-neutral-300">
                                <Check className="w-4 h-4 text-purple-500 shrink-0" />
                                <span>Custom Safety Rules</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-neutral-300">
                                <Check className="w-4 h-4 text-purple-500 shrink-0" />
                                <span>Self-Hosted Option</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-neutral-300">
                                <Check className="w-4 h-4 text-purple-500 shrink-0" />
                                <span>Dedicated Support Channel</span>
                            </div>
                        </div>

                        <Link
                            to="/contact"
                            className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white text-center font-bold rounded-lg transition-colors"
                        >
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </section>

            {/* 3. FAQ */}
            <section className="py-24 px-6 border-t border-neutral-800 bg-neutral-900/30">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2 flex items-start gap-3">
                                <HelpCircle className="w-5 h-5 text-neutral-500 mt-1" />
                                Does SupaSQL host my database?
                            </h3>
                            <p className="text-neutral-400 pl-8">
                                No. SupaSQL is a control plane. We connect to your existing
                                PostgreSQL database (Supabase, AWS, etc.) via connection string.
                                Your data never leaves your infrastructure.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2 flex items-start gap-3">
                                <HelpCircle className="w-5 h-5 text-neutral-500 mt-1" />
                                Can I export the SQL?
                            </h3>
                            <p className="text-neutral-400 pl-8">
                                Yes. You can export standard PostgreSQL DDL at any time. You are
                                not locked into our platform.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2 flex items-start gap-3">
                                <HelpCircle className="w-5 h-5 text-neutral-500 mt-1" />
                                How does the "Safety Engine" work?
                            </h3>
                            <p className="text-neutral-400 pl-8">
                                We parse your proposed schema changes and run them against a set
                                of best-practice rules. We check for things like locking issues,
                                missing indexes on foreign keys, and destructive drops.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
