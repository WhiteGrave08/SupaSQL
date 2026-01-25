import React from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ArrowRight } from "lucide-react";

export const LandingContact = () => {
    return (
        <div className="animate-in fade-in duration-700">
            {/* 1. HERO */}
            <section className="pt-32 pb-20 px-6 text-center">
                <h1 className="text-5xl font-bold text-white mb-6">
                    Get in touch.
                </h1>
                <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                    Have questions about enterprise security or custom deployments?
                    Our team is ready to help.
                </p>
            </section>

            <section className="pb-32 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* LEFT: Contact Information (The User's Request) */}
                    <div className="space-y-8">
                        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl relative overflow-hidden group">
                            {/* Background Decoration */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-blue-600/20 transition-all duration-500"></div>

                            <h3 className="text-2xl font-bold text-white mb-8 relative z-10">
                                Direct Contact
                            </h3>

                            <div className="space-y-8 relative z-10">
                                {/* Person */}
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center border border-neutral-700">
                                        <span className="text-xl font-bold text-white">MD</span>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white">Mary Dolo</h4>
                                        <p className="text-blue-500 font-medium">Head of Sales & Growth</p>
                                    </div>
                                </div>

                                <div className="h-px bg-neutral-800 w-full"></div>

                                {/* Details Grid */}
                                <div className="space-y-6">
                                    <a href="mailto:dolomary47@gmail.com" className="flex items-center gap-4 text-neutral-300 hover:text-white transition-colors group/link">
                                        <div className="w-10 h-10 bg-neutral-950 border border-neutral-800 rounded-lg flex items-center justify-center group-hover/link:border-blue-500/50 transition-colors">
                                            <Mail className="w-5 h-5 text-neutral-400 group-hover/link:text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Email</p>
                                            <p className="font-mono text-lg">dolomary47@gmail.com</p>
                                        </div>
                                    </a>

                                    <a href="tel:+22394454011" className="flex items-center gap-4 text-neutral-300 hover:text-white transition-colors group/link">
                                        <div className="w-10 h-10 bg-neutral-950 border border-neutral-800 rounded-lg flex items-center justify-center group-hover/link:border-green-500/50 transition-colors">
                                            <Phone className="w-5 h-5 text-neutral-400 group-hover/link:text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Phone</p>
                                            <p className="font-mono text-lg">+223 94 45 40 11</p>
                                        </div>
                                    </a>

                                    <div className="flex items-center gap-4 text-neutral-300">
                                        <div className="w-10 h-10 bg-neutral-950 border border-neutral-800 rounded-lg flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-neutral-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider">HQ Location</p>
                                            <p className="font-mono text-lg">Bamako, Mali</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Support Info */}
                        <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-3xl">
                            <h4 className="font-bold text-white mb-4">Support Hours</h4>
                            <div className="flex items-start gap-4 mb-4">
                                <Clock className="w-5 h-5 text-neutral-500 mt-1" />
                                <div>
                                    <p className="text-neutral-300">Monday — Friday</p>
                                    <p className="text-neutral-500 text-sm">9:00 AM — 6:00 PM (GMT)</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <MessageSquare className="w-5 h-5 text-neutral-500 mt-1" />
                                <div>
                                    <p className="text-neutral-300">Response Time</p>
                                    <p className="text-neutral-500 text-sm">Usually within 24 hours for Pro plans.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Visual Form */}
                    <div className="bg-neutral-950 border border-neutral-800 p-8 lg:p-12 rounded-3xl shadow-2xl">
                        <h3 className="text-2xl font-bold text-white mb-2">Send us a message</h3>
                        <p className="text-neutral-500 mb-8">Tell us about your team and schema requirements.</p>

                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-neutral-500 uppercase">First Name</label>
                                    <input type="text" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors" placeholder="Jane" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-neutral-500 uppercase">Last Name</label>
                                    <input type="text" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors" placeholder="Doe" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-500 uppercase">Work Email</label>
                                <input type="email" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors" placeholder="jane@company.com" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-500 uppercase">Message</label>
                                <textarea rows={4} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors resize-none" placeholder="We need to secure our Postgres schema..."></textarea>
                            </div>

                            <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 group">
                                Send Message
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </div>

                </div>
            </section>
        </div>
    );
};
