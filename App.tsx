import React, { useCallback, useMemo, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Panel,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";

import { useStore, ViewType } from "./store";
import { TableNode } from "./components/Editor/TableNode";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { AIPanel } from "./components/Editor/AIPanel";
import { PropertiesPanel } from "./components/Editor/PropertiesPanel";
import { Auth } from "./components/Auth";
import { EditorHeader } from "./components/Editor/EditorHeader";
import { RelationInspector } from "./components/Editor/RelationInspector";
import { SessionActivityFeed } from "./components/Editor/SessionActivityFeed";
import { CodeView } from "./components/Editor/CodeView";
import { supabase } from "./lib/supabase";
import {
  Sparkles,
  Terminal,
  FileCode,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Database,
  Cpu,
  HardDrive,
  ShieldAlert,
  Search,
  Lock,
  ExternalLink,
  RefreshCcw,
  Loader2,
  Plus,
  Table,
  ChevronRight,
  Trash2,
  History,
  Activity,
} from "lucide-react";
import { schemaToPostgresSQL } from "./lib/schema-utils";

// Node types moved inside Editor with useMemo to resolve React Flow warning

// --- DUMMY VIEW COMPONENTS ---

const ProjectsListView = () => {
  const { projects, createProject, selectProject, deleteProject, isLoading } =
    useStore();
  const [newProjectName, setNewProjectName] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  const handleCreate = async () => {
    if (newProjectName && !isLoading) {
      await createProject(newProjectName);
      setIsCreating(false);
      setNewProjectName("");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Your Projects
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Select a project to manage its schema decisions.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isCreating && (
          <div className="p-6 bg-neutral-900 border-2 border-dashed border-blue-500/50 rounded-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-sm font-bold text-white mb-4">
              Name your project
            </h3>
            <input
              autoFocus
              type="text"
              disabled={isLoading}
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") setIsCreating(false);
              }}
              placeholder="e.g. E-commerce App"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 mb-4 disabled:opacity-50"
            />
            <div className="flex items-center gap-2">
              <button
                disabled={isLoading || !newProjectName}
                onClick={handleCreate}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  "Create"
                )}
              </button>
              <button
                disabled={isLoading}
                onClick={() => setIsCreating(false)}
                className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-md transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => selectProject(project.id)}
            className="group relative p-6 bg-neutral-900 border border-neutral-800 rounded-2xl hover:border-blue-500/50 transition-all cursor-pointer hover:shadow-2xl hover:shadow-blue-500/5"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="p-3 bg-neutral-800 rounded-xl group-hover:bg-blue-500/10 transition-colors">
                <Database className="w-6 h-6 text-neutral-400 group-hover:text-blue-500" />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Are you sure you want to delete this project?"))
                    deleteProject(project.id);
                }}
                className="p-1.5 text-neutral-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {project.name}
            </h3>
            <p className="text-xs text-neutral-500 mb-4 items-center flex gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Updated {new Date(project.updated_at).toLocaleDateString()}
            </p>
            <div className="flex items-center gap-4 text-[10px] text-neutral-400 font-bold uppercase tracking-widest pt-4 border-t border-neutral-800">
              <span className="flex items-center gap-1.5">
                <Table className="w-3 h-3" />{" "}
                {(project.data as any).tables?.length || 0} Tables
              </span>
              <span className="flex items-center gap-1.5">
                <RefreshCcw className="w-3 h-3" /> V
                {(project.data as any).version || "1.0.0"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectDetailOverview = () => {
  const {
    currentSchema,
    activityLogs,
    selectProject,
    setView,
    projects,
    currentProjectId,
  } = useStore();
  const project = projects.find((p) => p.id === currentProjectId);

  const tablesCount = (currentSchema?.tables || []).length;
  const relationsCount = (currentSchema?.relationships || []).map
    ? (currentSchema?.relationships || []).length
    : 0;
  const indexCount = (currentSchema?.tables || []).reduce(
    (acc, t) => acc + (t.columns || []).filter((c) => c.isPrimaryKey).length,
    0
  );
  const rlsCount = 0;

  const isHealthy = tablesCount > 0 && relationsCount > 0;
  const healthStatus =
    tablesCount === 0 ? "Empty" : isHealthy ? "Healthy" : "Needs Review";
  const healthColor =
    tablesCount === 0
      ? "text-neutral-500"
      : isHealthy
      ? "text-green-500"
      : "text-orange-500";

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 h-full overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-3 text-sm text-neutral-500 mb-2">
        <button
          onClick={() => selectProject(null)}
          className="hover:text-white transition-colors"
        >
          Projects
        </button>
        <span>/</span>
        <span className="text-white font-medium">
          {project?.name || "Loading..."}
        </span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Schema Decision Control Center
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Analyze health and review critical design decisions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-md flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase">
              Branch: main
            </span>
          </div>
          <button
            onClick={() => setView("editor")}
            className="px-4 py-1.5 bg-white text-black text-xs font-bold rounded-md hover:bg-neutral-200 transition-colors"
          >
            Open Editor
          </button>
        </div>
      </div>

      {/* Top Row: Health & Risk */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ShieldAlert className="w-24 h-24 text-green-500" />
          </div>
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">
            Schema Health
          </h3>
          <div className="flex items-end gap-2 mb-2">
            <span className={`text-3xl font-bold ${healthColor}`}>
              {healthStatus === "Healthy"
                ? "🟢 "
                : healthStatus === "Needs Review"
                ? "⚠️ "
                : "⚪ "}
              {healthStatus}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-neutral-500 italic">
              {tablesCount === 0
                ? "No tables defined yet"
                : isHealthy
                ? "No blocking issues"
                : "Consider adding relationships"}
            </p>
          </div>
        </div>

        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">
            Migration Status
          </h3>
          <div className="text-3xl font-bold text-white mb-1">0 Pending</div>
          <p className="text-[10px] text-green-500 font-bold uppercase">
            Ready to deploy
          </p>
        </div>

        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Security Coverage
            </h3>
            <button
              onClick={() => setView("rls")}
              className="text-[10px] text-blue-500 hover:underline"
            >
              Review Policies
            </button>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {rlsCount} / {tablesCount}
          </div>
          <p className="text-[10px] text-orange-500 font-bold uppercase">
            ⚠️ {tablesCount - rlsCount} tables unprotected
          </p>
        </div>
      </div>

      {/* Middle Row: Structure & Intelligence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">
            Schema Structure
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{tablesCount}</div>
              <div className="text-[9px] text-neutral-500 uppercase font-bold">
                Tables
              </div>
            </div>
            <div className="text-center border-x border-neutral-800">
              <div className="text-xl font-bold text-white">
                {relationsCount}
              </div>
              <div className="text-[9px] text-neutral-500 uppercase font-bold">
                Relations
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">{indexCount}</div>
              <div className="text-[9px] text-neutral-500 uppercase font-bold">
                Indexes
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl relative group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-blue-500" /> AI Insights
            </h3>
            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[8px] font-bold rounded italic">
              Active
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1"></div>
              <p className="text-xs text-neutral-300">
                Consider adding Foreign Key constraints to `orders` table to
                improve data integrity.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1"></div>
              <p className="text-xs text-neutral-300">
                Normalization status: Stable for current scale.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Decisions */}
      <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
            Recent Schema Decisions
          </h3>
          <button
            onClick={() => setView("logs")}
            className="text-[10px] text-neutral-500 hover:text-white transition-colors"
          >
            View All Logs
          </button>
        </div>
        <div className="space-y-1">
          {activityLogs.length === 0 ? (
            <div className="text-center py-12 bg-neutral-950/50 rounded-xl border border-dashed border-neutral-800">
              <History className="w-8 h-8 text-neutral-800 mx-auto mb-2" />
              <p className="text-xs text-neutral-600 italic">
                No recent decisions recorded.
              </p>
            </div>
          ) : (
            activityLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between py-3 px-4 hover:bg-neutral-800/30 rounded-xl transition-all group border border-transparent hover:border-neutral-800"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      log.action.includes("ADD")
                        ? "bg-green-500/10 border-green-500/20 text-green-500"
                        : log.action.includes("REMOVE")
                        ? "bg-red-500/10 border-red-500/20 text-red-500"
                        : log.action.includes("DEPLOY")
                        ? "bg-purple-500/10 border-purple-500/20 text-purple-500"
                        : "bg-blue-500/10 border-blue-500/20 text-blue-500"
                    }`}
                  >
                    {log.action.includes("ADD") ? (
                      <Plus className="w-4 h-4" />
                    ) : log.action.includes("REMOVE") ? (
                      <Trash2 className="w-4 h-4" />
                    ) : (
                      <Activity className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white tracking-tight">
                        {log.action.replace(/_/g, " ")}
                      </p>
                      <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded font-mono uppercase">
                        {log.item_name}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-600 font-medium">
                      {new Date(log.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      • {new Date(log.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  {log.details?.risk === "high" && (
                    <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[8px] font-bold rounded-full border border-red-500/20 uppercase tracking-tighter">
                      High Risk
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-neutral-700" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const OverviewView = () => {
  const { currentProjectId } = useStore();
  return currentProjectId ? <ProjectDetailOverview /> : <ProjectsListView />;
};

const MonitoringView = () => (
  <div className="p-8 space-y-6 animate-in fade-in duration-500">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-bold">API Performance</h1>
      <select className="bg-neutral-900 border border-neutral-800 text-xs rounded-md px-3 py-1.5 text-neutral-300">
        <option>Last 24 Hours</option>
        <option>Last 7 Days</option>
      </select>
    </div>
    <div className="h-64 w-full bg-neutral-900/50 border border-neutral-800 rounded-xl relative flex items-end p-4 gap-2">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="flex-1 bg-blue-500/30 border-t border-blue-500"
          style={{ height: `${Math.random() * 80 + 20}%` }}
        ></div>
      ))}
      <div className="absolute top-4 left-4 text-[10px] text-neutral-600 uppercase font-bold">
        Database Reads / s
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {["Avg Latency", "Error Rate", "Active Conn", "Cache Hit"].map((l, i) => (
        <div
          key={i}
          className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg"
        >
          <div className="text-[10px] text-neutral-500 uppercase font-bold mb-1">
            {l}
          </div>
          <div className="text-lg font-bold">
            {(Math.random() * 10).toFixed(2)}
            {i === 1 ? "%" : "ms"}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const RlsPoliciesView = () => {
  const { currentSchema } = useStore();
  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <h1 className="text-xl font-bold">Row Level Security</h1>
      <div className="space-y-3">
        {(currentSchema?.tables || []).map((table) => (
          <div
            key={table.id}
            className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-lg ${
                  table.name === "users" ? "bg-green-500/10" : "bg-red-500/10"
                }`}
              >
                <Lock
                  className={`w-4 h-4 ${
                    table.name === "users" ? "text-green-500" : "text-red-500"
                  }`}
                />
              </div>
              <div>
                <h4 className="text-sm font-semibold">{table.name}</h4>
                <p className="text-[10px] text-neutral-500">
                  {table.name === "users"
                    ? "Protected by 2 policies"
                    : "No policies defined. WARNING: Data is public."}
                </p>
              </div>
            </div>
            <button className="text-xs font-bold text-blue-500 hover:text-blue-400">
              Manage Policies
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const LogsView = () => (
  <div className="p-8 animate-in fade-in duration-500">
    <h1 className="text-xl font-bold mb-6">Audit Logs</h1>
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
      <table className="w-full text-xs text-left">
        <thead className="bg-neutral-800/50 text-neutral-400">
          <tr>
            <th className="px-4 py-3 font-medium">TIMESTAMP</th>
            <th className="px-4 py-3 font-medium">USER</th>
            <th className="px-4 py-3 font-medium">ACTION</th>
            <th className="px-4 py-3 font-medium">RESOURCE</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <tr key={i} className="hover:bg-neutral-800/30 transition-colors">
              <td className="px-4 py-3 text-neutral-500 font-mono">
                2023-10-27 14:2{i}:12
              </td>
              <td className="px-4 py-3">alex@example.com</td>
              <td className="px-4 py-3 font-bold">ALTER_TABLE</td>
              <td className="px-4 py-3 text-blue-400">schema/public/users</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- MODALS & DRAWERS ---

const ConsoleDrawer = () => {
  const { isConsoleOpen, setConsoleOpen } = useStore();
  const [history, setHistory] = useState([
    "Connected to SupaSQL-Main...",
    'Ready for commands. Try "SELECT * FROM users;"',
  ]);
  const [input, setInput] = useState("");

  if (!isConsoleOpen) return null;

  return (
    <div className="h-64 border-t border-neutral-800 bg-[#0a0a0a] flex flex-col z-40">
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-900/50 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
            Interactive SQL Console
          </span>
        </div>
        <button onClick={() => setConsoleOpen(false)}>
          <ChevronDown className="w-4 h-4 text-neutral-500" />
        </button>
      </div>
      <div className="flex-1 p-4 font-mono text-[11px] overflow-y-auto custom-scrollbar">
        {history.map((h, i) => (
          <div key={i} className="mb-1">
            <span className="text-blue-500 mr-2">❯</span> {h}
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="text-blue-500">❯</span>
          <input
            autoFocus
            className="bg-transparent outline-none flex-1 text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && input) {
                setHistory([...history, input, `Executed locally: [OK]`]);
                setInput("");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

const SettingsModal = () => {
  const { isSettingsOpen, setSettingsOpen } = useStore();
  if (!isSettingsOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <h2 className="text-lg font-bold">Project Settings</h2>
          <button
            onClick={() => setSettingsOpen(false)}
            className="p-2 hover:bg-neutral-800 rounded-md"
          >
            ×
          </button>
        </div>
        <div className="p-6 grid grid-cols-4 gap-6">
          <div className="col-span-1 space-y-1">
            {["General", "Database", "Auth", "API Keys", "Billing"].map(
              (t, i) => (
                <div
                  key={i}
                  className={`px-3 py-2 rounded-md text-sm cursor-pointer ${
                    i === 0
                      ? "bg-neutral-800 text-white font-medium"
                      : "text-neutral-500 hover:text-white"
                  }`}
                >
                  {t}
                </div>
              )
            )}
          </div>
          <div className="col-span-3 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase">
                Project Name
              </label>
              <input
                className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm"
                placeholder="SupaSQL Production"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase">
                Primary Region
              </label>
              <select className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm">
                <option>us-east-1 (N. Virginia)</option>
                <option>eu-west-1 (Ireland)</option>
              </select>
            </div>
            <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
              <button
                onClick={() => setSettingsOpen(false)}
                className="px-4 py-2 text-xs font-bold text-neutral-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-md transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeployModal = () => {
  const { isDeploying, setDeploying } = useStore();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isDeploying) {
      setStep(0);
      const timer = setInterval(() => {
        setStep((s) => {
          if (s >= 3) {
            clearInterval(timer);
            setTimeout(() => setDeploying(false), 1500);
            return 3;
          }
          return s + 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isDeploying]);

  if (!isDeploying) return null;

  const steps = [
    "Validating DDL changes...",
    "Generating migration plan...",
    "Executing SQL on target nodes...",
    "Finished! Cluster updated.",
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="w-80 space-y-6 text-center">
        <div className="relative w-16 h-16 mx-auto">
          {step < 3 ? (
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
          ) : (
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          )}
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-lg">
            {step < 3 ? "Deploying Changes" : "Deployment Complete"}
          </h3>
          <p className="text-sm text-neutral-500">{steps[step]}</p>
        </div>
        <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-1000 ease-in-out"
            style={{ width: `${((step + 1) / 4) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// --- MAIN EDITOR ---

const Editor = () => {
  const nodeTypes = useMemo(
    () => ({
      tableNode: TableNode,
    }),
    []
  );

  const {
    currentSchema,
    currentView,
    isConsoleOpen,
    setConsoleOpen,
    error,
    selectRelationship,
    validateSchema,
    activeRightPanel,
    setActiveRightPanel,
  } = useStore();

  const initialNodes = useMemo(
    () =>
      (currentSchema?.tables || []).map((table) => ({
        id: table.id,
        type: "tableNode",
        position: table.position || { x: 0, y: 0 },
        data: table,
      })),
    [currentSchema?.tables]
  );

  const initialEdges = useMemo(
    () =>
      (currentSchema?.relationships || []).map((rel) => ({
        id: rel.id,
        source: rel.fromTable,
        sourceHandle: `${rel.fromTable}-${rel.fromColumn}-out`,
        target: rel.toTable,
        targetHandle: `${rel.toTable}-${rel.toColumn}-in`,
        animated: true,
        label: rel.type,
      })),
    [currentSchema?.relationships]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { fetchData, addTable, updateTable } = useStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    validateSchema();
  }, [
    currentSchema,
    initialNodes,
    initialEdges,
    setNodes,
    setEdges,
    validateSchema,
  ]);

  const onNodesChangeInternal = useCallback(
    (changes: any) => {
      onNodesChange(changes);
      changes.forEach((change: any) => {
        if (change.type === "position" && change.position) {
          updateTable(change.id, { position: change.position });
        }
      });
    },
    [onNodesChange, updateTable]
  );

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // sqlPreview removed, handled in CodeView component

  const renderContent = () => {
    switch (currentView) {
      case "overview":
        return <OverviewView />;
      case "monitoring":
        return <MonitoringView />;
      case "rls":
        return <RlsPoliciesView />;
      case "logs":
        return <LogsView />;
      case "code":
        return <CodeView />;
      case "editor":
      default:
        return (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <EditorHeader />
            <div className="flex-1 relative">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChangeInternal}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onEdgeClick={(_, edge) => selectRelationship(edge.id)}
                nodeTypes={nodeTypes}
                fitView
                className="bg-dot-pattern"
              >
                <Background color="#1a1a1a" gap={20} />
                <Controls className="!bg-neutral-900 !border-neutral-800 !shadow-xl" />

                <Panel position="top-right" className="mt-4 mr-4">
                  <button
                    onClick={() => addTable("new_table")}
                    className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-xs font-bold text-neutral-200 hover:bg-neutral-800 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Table
                  </button>
                </Panel>

                <Panel position="bottom-center" className="mb-6">
                  <div className="flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-full px-4 py-2 shadow-2xl">
                    <button
                      onClick={() =>
                        setActiveRightPanel(
                          activeRightPanel === "ai" ? null : "ai"
                        )
                      }
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        activeRightPanel === "ai"
                          ? "bg-blue-600 text-white"
                          : "hover:bg-neutral-800 text-neutral-300"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Assistant
                    </button>
                  </div>
                </Panel>

                <RelationInspector />
              </ReactFlow>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-[#0a0a0a] overflow-hidden text-neutral-100">
      <Header />
      <SettingsModal />
      <DeployModal />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 relative bg-neutral-950 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            {error && (
              <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 flex items-center justify-between">
                <p className="text-xs text-red-500 font-medium flex items-center gap-2">
                  <ShieldAlert className="w-3 h-3" />
                  {error}
                </p>
                <button
                  onClick={() => useStore.setState({ error: null })}
                  className="text-[10px] text-red-500/50 hover:text-red-500 uppercase font-bold"
                >
                  Dismiss
                </button>
              </div>
            )}
            {renderContent()}
          </div>

          <ConsoleDrawer />

          <div className="h-8 border-t border-neutral-800 bg-[#0a0a0a] px-4 flex items-center justify-between text-[10px] text-neutral-500 shrink-0">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>{" "}
                Connected
              </span>
              <span>Workspace: Enterprise</span>
              <span>Last saved: 2m ago</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setConsoleOpen(!isConsoleOpen)}
                className="hover:text-neutral-300 flex items-center gap-1"
              >
                {isConsoleOpen ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronUp className="w-3 h-3" />
                )}
                Console
              </button>
            </div>
          </div>
        </main>

        {currentView === "editor" && activeRightPanel && (
          <div className="w-80 h-full border-l border-neutral-800 bg-[#0a0a0a] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {activeRightPanel === "properties" && <PropertiesPanel />}
            {activeRightPanel === "ai" && <AIPanel />}
            {activeRightPanel === "activity" && <SessionActivityFeed />}
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const { user, checkUser } = useStore();

  useEffect(() => {
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      useStore.setState({ user: session?.user ?? null });
      if (session?.user) {
        useStore.getState().fetchData();
      }
    });

    return () => subscription.unsubscribe();
  }, [checkUser]);

  if (!user) {
    return <Auth />;
  }

  return (
    <ReactFlowProvider>
      <Editor />
    </ReactFlowProvider>
  );
}
