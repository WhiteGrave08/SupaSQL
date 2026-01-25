import React from "react";
import {
  Database,
  GitBranch,
  Play,
  Share2,
  Search,
  Settings,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useStore } from "../store";
import logo from "../assets/images/logo.svg";

export const Header: React.FC = () => {
  const { setSettingsOpen, setDeploying, setView, currentView, user, signOut } =
    useStore();

  return (
    <header className="h-14 border-b border-neutral-800 flex items-center justify-between px-4 bg-[#0a0a0a] sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setView("overview")}
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <img src={logo} alt="SupaSQL Logo" className="w-8 h-8" />
          </div>
          <span className="font-bold text-lg tracking-tight">SupaSQL</span>
        </div>

        <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-neutral-400">
          <span className="text-neutral-700">/</span>
          <span
            className={`text-neutral-100 capitalize ${currentView === "editor" ? "font-bold" : ""
              }`}
          >
            {currentView === 'overview' ? 'Overview' : currentView}
          </span>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => alert("Deployment functionality coming soon!")}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-neutral-100 text-neutral-900 rounded-md text-sm font-semibold hover:bg-neutral-200 transition-colors"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Deploy</span>
        </button>

        <div className="h-8 w-[1px] bg-neutral-800 mx-1"></div>

        <div className="flex items-center gap-2 px-2 py-1 bg-neutral-900/50 border border-neutral-800 rounded-lg">
          <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
            <UserIcon className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <span className="text-xs font-medium text-neutral-300 hidden lg:block max-w-[120px] truncate">
            {user?.email}
          </span>
          <button
            onClick={() => signOut()}
            className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => setSettingsOpen(true)}
          className="p-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 rounded-md transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
