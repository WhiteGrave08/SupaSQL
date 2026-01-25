import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Database, Menu, X, Github, Twitter } from "lucide-react";

export const LandingLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
            {/* Sticky Header */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="p-1.5 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-colors">
                            <Database className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">SupaSQL</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
                        <Link to="/" className="hover:text-white transition-colors">
                            Home
                        </Link>
                        <Link to="/product" className="hover:text-white transition-colors">
                            Product
                        </Link>
                        <Link to="/pricing" className="hover:text-white transition-colors">
                            Pricing
                        </Link>
                        <Link to="/contact" className="hover:text-white transition-colors">
                            Contact
                        </Link>
                    </nav>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                        >
                            Sign in
                        </Link>
                        <Link
                            to="/signup"
                            className="px-4 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-neutral-200 transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-neutral-400 hover:text-white"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Nav */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-neutral-800 bg-neutral-950 p-6 space-y-4 animate-in slide-in-from-top-4">
                        <Link
                            to="/"
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-lg font-medium text-neutral-400 hover:text-white"
                        >
                            Home
                        </Link>
                        <Link
                            to="/product"
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-lg font-medium text-neutral-400 hover:text-white"
                        >
                            Product
                        </Link>
                        <Link
                            to="/pricing"
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-lg font-medium text-neutral-400 hover:text-white"
                        >
                            Pricing
                        </Link>
                        <Link
                            to="/contact"
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-lg font-medium text-neutral-400 hover:text-white"
                        >
                            Contact
                        </Link>
                        <div className="pt-4 border-t border-neutral-800 space-y-4">
                            <Link
                                to="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="block text-center text-lg font-medium text-neutral-400 hover:text-white"
                            >
                                Sign in
                            </Link>
                            <Link
                                to="/signup"
                                onClick={() => setIsMenuOpen(false)}
                                className="block w-full py-3 bg-white text-black text-center font-bold rounded-lg hover:bg-neutral-200"
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="pt-16 min-h-[calc(100vh-80px)]">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-neutral-800 bg-neutral-950 py-12">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1 bg-neutral-800 rounded">
                                <Database className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold tracking-tight">SupaSQL</span>
                        </div>
                        <p className="text-sm text-neutral-500">
                            The schema decision control center for modern engineering teams.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-neutral-500">
                            <li>
                                <Link to="/product" className="hover:text-white transition-colors">
                                    Visual Editor
                                </Link>
                            </li>
                            <li>
                                <Link to="/product" className="hover:text-white transition-colors">
                                    Audit Logs
                                </Link>
                            </li>
                            <li>
                                <Link to="/pricing" className="hover:text-white transition-colors">
                                    Pricing
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-neutral-500">
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Documentation
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    API Reference
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Blog
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-neutral-500">
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Privacy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Terms
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-600">
                    <p>© 2024 SupaSQL Inc. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-white transition-colors">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                            <Github className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
