import React from "react";
import { Check, Zap, Shield, Rocket } from "lucide-react";
import { useStore } from "../store";

export const PlansView = () => {
    const { setView } = useStore();

    return (
        <div className="p-8 max-w-6xl mx-auto animate-in fade-in duration-500 overflow-y-auto h-full custom-scrollbar">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-4">Upgrade your Workspace</h1>
                <p className="text-neutral-400 max-w-2xl mx-auto">
                    Unlock advanced security features, unlimited tables, and team collaboration tools.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Free Plan */}
                <div className="p-8 rounded-3xl border border-neutral-800 bg-neutral-900/50 flex flex-col relative">
                    <h3 className="text-lg font-bold text-white mb-2">Starter</h3>
                    <div className="text-3xl font-bold text-white mb-6">$0 <span className="text-sm font-normal text-neutral-500">/mo</span></div>

                    <div className="space-y-4 flex-1 mb-8">
                        {['50 Tables', 'Basic Type Checking', 'Community Support', '1 Project'].map(f => (
                            <div key={f} className="flex items-center gap-3 text-sm text-neutral-400">
                                <Check className="w-4 h-4 text-neutral-600" /> {f}
                            </div>
                        ))}
                    </div>

                    <button className="w-full py-3 rounded-xl border border-neutral-700 text-white font-bold text-sm bg-neutral-800 cursor-default opacity-50">
                        Current Plan
                    </button>
                </div>

                {/* Pro Plan */}
                <div className="p-8 rounded-3xl border border-blue-500/30 bg-blue-500/5 flex flex-col relative transform scale-105 shadow-2xl shadow-blue-900/20">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-lg">
                        RECOMMENDED
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-blue-400" /> Pro
                    </h3>
                    <div className="text-3xl font-bold text-white mb-6">$29 <span className="text-sm font-normal text-neutral-500">/mo</span></div>

                    <div className="space-y-4 flex-1 mb-8">
                        {['Unlimited Tables', 'Advanced RLS Intelligence', 'Priority Email Support', 'Automated Backups', 'Team Collaboration (up to 5)'].map(f => (
                            <div key={f} className="flex items-center gap-3 text-sm text-neutral-300">
                                <Check className="w-4 h-4 text-blue-500" /> {f}
                            </div>
                        ))}
                    </div>

                    <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg hover:shadow-blue-600/25">
                        Upgrade to Pro
                    </button>
                </div>

                {/* Enterprise Plan */}
                <div className="p-8 rounded-3xl border border-purple-500/20 bg-purple-500/5 flex flex-col relative">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        <Rocket className="w-5 h-5 text-purple-400" /> Enterprise
                    </h3>
                    <div className="text-3xl font-bold text-white mb-6">Custom <span className="text-sm font-normal text-neutral-500"></span></div>

                    <div className="space-y-4 flex-1 mb-8">
                        {['SSO & Advanced Security', 'Audit Logs (Unlimited)', 'Dedicated Success Manager', 'On-premise Deployment Options', 'SLA 99.99%'].map(f => (
                            <div key={f} className="flex items-center gap-3 text-sm text-neutral-300">
                                <Shield className="w-4 h-4 text-purple-500" /> {f}
                            </div>
                        ))}
                    </div>

                    <button className="w-full py-3 rounded-xl border border-purple-500/30 text-purple-400 font-bold text-sm hover:bg-purple-500/10 transition-colors">
                        Contact Sales
                    </button>
                </div>
            </div>

            <div className="mt-12 text-center">
                <button onClick={() => setView('overview')} className="text-sm text-neutral-500 hover:text-white transition-colors">
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
};
