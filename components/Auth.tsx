import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useStore } from "../store";
import {
  Mail,
  Lock,
  Loader2,
  Github,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Database,
} from "lucide-react";
import logo from "../assets/images/logo.svg";

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { checkUser } = useStore();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Check your email for the confirmation link!");
      }
      await checkUser();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">
      {/* Left Side: Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 z-10 bg-[#050505]">
        <div className="max-w-md w-full mx-auto space-y-10">
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-700">
            <img src={logo} alt="SupaSQL" className="w-10 h-10" />
            <span className="text-2xl font-bold tracking-tight">SupaSQL</span>
          </div>

          <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
            <h1 className="text-4xl font-bold tracking-tight">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-neutral-500 flex items-center gap-2">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-500 font-semibold hover:text-blue-400 transition-colors"
              >
                {isLogin ? "Create an account" : "Sign in"}
              </button>
            </p>
          </div>

          <form
            onSubmit={handleAuth}
            className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-700 delay-200"
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-300 ml-1">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-purple-500 transition-colors" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full h-12 pl-11 pr-4 bg-neutral-900/50 border border-neutral-800 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm placeholder:text-neutral-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-medium text-neutral-300">
                    Password
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      className="text-xs font-semibold text-neutral-500 hover:text-neutral-300"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full h-12 pl-11 pr-4 bg-neutral-900/50 border border-neutral-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm placeholder:text-neutral-600"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-500 font-medium animate-in shake duration-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign in" : "Create account"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#050505] px-4 text-neutral-500 font-bold tracking-widest">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full h-12 bg-white text-black hover:bg-neutral-100 rounded-xl font-bold flex items-center justify-center gap-3 transition-all border border-neutral-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>
          </form>

          <p className="text-center text-xs text-neutral-600 px-8 leading-relaxed animate-in fade-in duration-700 delay-300">
            By continuing, you agree to our{" "}
            <span className="underline decoration-neutral-800 underline-offset-4">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="underline decoration-neutral-800 underline-offset-4">
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </div>

      {/* Right Side: Visual Panel */}
      <div className="hidden lg:flex flex-1 relative bg-purple-600 overflow-hidden">
        {/* Abstract Background pattern with CSS */}
        <div className="absolute inset-0 bg-[#0a0a0a]">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/30 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>

          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, #333 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        {/* Floating Content Card (Reference style) */}
        <div className="relative z-10 m-auto max-w-lg w-full px-8">
          <div className="relative group">
            {/* Main Image from Artifacts if possible, or high-end CSS card */}
            <div className="bg-neutral-900/40 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl space-y-8 transform hover:scale-[1.02] transition-transform duration-500">
              <div className="flex items-center justify-between">
                <div className="p-4 bg-purple-500/20 rounded-2xl border border-purple-500/20 shadow-inner">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-500`}
                    >
                      U{i}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-3xl font-bold tracking-tight">
                  AI-First Database Design
                </h3>
                <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                  Experience the future of schema management. Design,
                  collaborate, and export with native Supabase performance.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                  <Database className="w-5 h-5 text-purple-400" />
                  <div className="text-xl font-bold">5,000+</div>
                  <div className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">
                    Schemas Generated
                  </div>
                </div>
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  <div className="text-xl font-bold">100%</div>
                  <div className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">
                    Secure Deployments
                  </div>
                </div>
              </div>
            </div>

            {/* Decals */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-purple-500 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-blue-500 rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-opacity"></div>
          </div>
        </div>

        {/* Bottom Badge */}
        <div className="absolute bottom-12 left-12 flex items-center gap-3">
          <div className="px-3 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold tracking-widest uppercase text-neutral-400">
            V0.0.1 Release
          </div>
        </div>
      </div>
    </div>
  );
};
