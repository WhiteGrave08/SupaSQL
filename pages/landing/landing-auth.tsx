import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Database, Github, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

const AuthLayout = ({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) => (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-neutral-100">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Brand */}
        <Link to="/" className="mb-8 flex items-center gap-2 group relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="p-1.5 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-colors">
                <Database className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">SupaSQL</span>
        </Link>

        <div className="max-w-md w-full bg-neutral-900/50 border border-neutral-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl relative z-10 animate-in zoom-in-95 duration-500">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
                <p className="text-neutral-400 text-sm">
                    {subtitle}
                </p>
            </div>

            {children}
        </div>

        <div className="mt-8 text-center text-xs text-neutral-600 relative z-10">
            <p>© 2024 SupaSQL Inc. Soc2 Secure.</p>
        </div>
    </div>
);

export const LandingLogin = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            navigate('/app');
        } catch (err: any) {
            setError(err.message || "Failed to sign in");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Welcome back" subtitle="Sign in to your dashboard">
            <form className="space-y-4" onSubmit={handleLogin}>
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-xs text-red-500">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase">Email</label>
                    <input
                        type="email"
                        autoFocus
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-neutral-950/50 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                        placeholder="you@company.com"
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-neutral-500 uppercase">Password</label>
                        <a href="#" className="text-xs text-blue-500 hover:text-blue-400">Forgot?</a>
                    </div>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-neutral-950/50 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-white hover:bg-neutral-200 text-black font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {isLoading ? "Signing in..." : "Sign In"}
                </button>

                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-neutral-900 px-2 text-neutral-500">Or continue with</span>
                    </div>
                </div>

                <button type="button" className="w-full py-3 bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                    <Github className="w-4 h-4" />
                    GitHub
                </button>

                <p className="text-center text-sm text-neutral-500 mt-6">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-white hover:underline font-medium">
                        Sign up
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export const LandingSignup = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName
                    }
                }
            });

            if (error) throw error;
            // For email confirmation flows, usually show a "Check your email" message.
            // But for this demo context, let's assume auto-confirm or direct login.
            navigate('/app');
        } catch (err: any) {
            setError(err.message || "Failed to create account");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Create your account" subtitle="Start designing secure schemas in minutes">
            <form className="space-y-4" onSubmit={handleSignup}>
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-xs text-red-500">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-500 uppercase">First Name</label>
                        <input
                            type="text"
                            autoFocus
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full bg-neutral-950/50 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                            placeholder="Jane"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-500 uppercase">Last Name</label>
                        <input
                            type="text"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full bg-neutral-950/50 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                            placeholder="Doe"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase">Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-neutral-950/50 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                        placeholder="you@company.com"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase">Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-neutral-950/50 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                        placeholder="Create a strong password"
                    />
                    <p className="text-[10px] text-neutral-500">Must be at least 8 characters.</p>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {isLoading ? "Creating account..." : "Get Started Free"}
                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>

                <p className="text-center text-sm text-neutral-500 mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-white hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};
