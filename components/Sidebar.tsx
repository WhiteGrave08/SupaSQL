import React from "react";
import {
  LayoutDashboard,
  FileJson,
  Code,
  Activity,
  ShieldCheck,
  History,
  Info,
} from "lucide-react";
import { useStore, ViewType } from "../store";

const NavItem = ({
  icon: Icon,
  label,
  view,
  active = false,
  disabled = false,
  onClick,
}: {
  icon: any;
  label: string;
  view: ViewType;
  active?: boolean;
  disabled?: boolean;
  onClick: (v: ViewType) => void;
}) => (
  <button
    disabled={disabled}
    onClick={() => !disabled && onClick(view)}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${active
      ? "bg-neutral-900 text-white font-medium"
      : disabled
        ? "text-neutral-700 cursor-not-allowed opacity-50"
        : "text-neutral-400 hover:text-white hover:bg-neutral-900/50"
      }`}
  >
    <Icon
      className={`w-4 h-4 ${active ? "text-blue-500" : ""} ${disabled ? "text-neutral-800" : ""
        }`}
    />
    {label}
  </button>
);

export const Sidebar: React.FC = () => {
  const { currentView, setView, currentProjectId, currentSchema } = useStore();
  const isNoProject = !currentProjectId;

  return (
    <aside className="w-64 border-r border-neutral-800 bg-[#0a0a0a] hidden lg:flex flex-col p-4 shrink-0">
      <div className="space-y-1">
        <NavItem
          icon={LayoutDashboard}
          label="Overview"
          view="overview"
          active={currentView === "overview"}
          onClick={setView}
        />
        <NavItem
          icon={FileJson}
          label="Editor"
          view="editor"
          active={currentView === "editor"}
          disabled={isNoProject}
          onClick={setView}
        />
        <NavItem
          icon={Code}
          label="Code View"
          view="code"
          active={currentView === "code"}
          disabled={isNoProject}
          onClick={setView}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest px-3 mb-2">
          Operations
        </h3>
        <div className="space-y-1">
          <NavItem
            icon={ShieldCheck}
            label="RLS Policies"
            view="rls"
            active={currentView === "rls"}
            disabled={isNoProject}
            onClick={setView}
          />
          <NavItem
            icon={Activity}
            label="Schema Health"
            view="health"
            active={currentView === "health"}
            disabled={isNoProject}
            onClick={setView}
          />
          <NavItem
            icon={History}
            label="Audit Logs"
            view="logs"
            active={currentView === "logs"}
            disabled={isNoProject}
            onClick={setView}
          />
        </div>
      </div>

      <div className="mt-auto p-4 bg-neutral-900/40 rounded-xl border border-neutral-800/50">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-semibold text-neutral-200">
            Pro Plan
          </span>
        </div>
        <p className="text-[10px] text-neutral-500 leading-relaxed mb-3">
          {isNoProject
            ? "Create a project to see your table limits."
            : `You are using ${currentSchema.tables.length} of 50 tables in this project.`}
        </p>
        <button
          onClick={() => setView('plans')}
          className="w-full py-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 text-white rounded transition-colors font-medium"
        >
          Upgrade Limits
        </button>
      </div>
    </aside>
  );
};
