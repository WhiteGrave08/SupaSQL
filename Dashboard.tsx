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
import { RlsPoliciesView } from "./components/RlsPoliciesView";
import { SchemaHealthView } from "./components/SchemaHealthView";
import { AuditLogsView } from "./components/AuditLogsView";
import { PlansView } from "./components/PlansView";
import { SettingsModal } from "./components/SettingsModal";
import { SafetyEngine } from "./lib/safety-engine";

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
    validationIssues,
  } = useStore();
  const project = projects.find((p) => p.id === currentProjectId);

  // 1. Calculate Real Stats
  const tables = currentSchema?.tables || [];
  const tablesCount = tables.length;
  const relationsCount = (currentSchema?.relationships || []).length;
  const indexCount = tables.reduce(
    (acc, t) => acc + (t.columns || []).filter((c) => c.isPrimaryKey).length,
    0
  );

  // 2. Calculate Real RLS & Security Stats using SafetyEngine
  const { rlsCount, criticalRisks, unshieldedCount } = useMemo(() => {
    let protectedCount = 0;
    let critical = 0;
    let unshielded = 0;

    tables.forEach(t => {
      // Analyze each table using the SafetyEngine (same logic as Health & RLS screens)
      const analysis = SafetyEngine.analyzeTable(t, currentSchema?.relationships || []);

      // Check for RLS/Protection (In SafetyEngine, 'low' risk implies some safety, 
      // but strictly counting "Safe" status is better)
      if (analysis.risk === 'low' || analysis.deployStatus === 'safe') {
        protectedCount++;
      } else {
        unshielded++;
      }

      if (analysis.risk === 'critical') critical++;
    });

    return { rlsCount: protectedCount, criticalRisks: critical, unshieldedCount: unshielded };
  }, [tables, currentSchema?.relationships]);

  // 3. Determine Overall Health Status
  let healthStatus = "Healthy";
  let healthColor = "text-green-500";
  let healthIcon = "🟢";

  if (tablesCount === 0) {
    healthStatus = "Empty";
    healthColor = "text-neutral-500";
    healthIcon = "⚪";
  } else if (criticalRisks > 0) {
    healthStatus = "Critical";
    healthColor = "text-red-500";
    healthIcon = "🔴";
  } else if (validationIssues.some(i => i.type === 'error') || unshieldedCount > 0) {
    healthStatus = "Needs Review";
    healthColor = "text-orange-500";
    healthIcon = "⚠️";
  }

  // 4. Get Top 3 Insights from Validation Issues
  const insights = validationIssues.slice(0, 3);

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
            <div className={`w-2 h-2 rounded-full animate-pulse ${healthStatus === 'Critical' ? 'bg-red-500' : 'bg-green-500'}`}></div>
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
        <div className={`p-5 bg-neutral-900 border ${healthStatus === 'Critical' ? 'border-red-500/20' : 'border-neutral-800'} rounded-2xl relative overflow-hidden group`}>
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ShieldAlert className={`w-24 h-24 ${healthColor}`} />
          </div>
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">
            Schema Health
          </h3>
          <div className="flex items-end gap-2 mb-2">
            <span className={`text-3xl font-bold ${healthColor}`}>
              {healthIcon} {healthStatus}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-neutral-500 italic">
              {tablesCount === 0
                ? "No tables defined yet"
                : criticalRisks > 0
                  ? `${criticalRisks} critical risks detected`
                  : unshieldedCount > 0
                    ? `${unshieldedCount} tables need protection`
                    : "System operating normally"}
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
          <p className={`text-[10px] font-bold uppercase ${unshieldedCount > 0 ? 'text-orange-500' : 'text-green-500'}`}>
            {unshieldedCount > 0 ? `⚠️ ${unshieldedCount} tables unprotected` : "✅ All tables protected"}
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
              Real-time
            </span>
          </div>
          <div className="space-y-3">
            {insights.length === 0 ? (
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1"></div>
                <p className="text-xs text-neutral-300">
                  {tablesCount === 0 ? "Add tables to generate insights." : "No critical issues detected. Schema looks clean."}
                </p>
              </div>
            ) : (
              insights.map((issue, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${issue.type === 'error' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                  <p className="text-xs text-neutral-300">
                    {issue.message}
                  </p>
                </div>
              ))
            )}
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
            activityLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between py-3 px-4 hover:bg-neutral-800/30 rounded-xl transition-all group border border-transparent hover:border-neutral-800"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border ${log.action.includes("ADD")
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

// MonitoringView removed - replaced by SchemaHealthView

// Old RlsPoliciesView removed - using imported component

// LogsView removed - replaced by AuditLogsView

// --- MODALS & DRAWERS ---



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
      case "health":
        return <SchemaHealthView />;
      case "rls":
        return <RlsPoliciesView />;
      case "logs":
        return <AuditLogsView />;
      case "plans":
        return <PlansView />;
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

          <div className="h-8 border-t border-neutral-800 bg-[#0a0a0a] px-4 flex items-center justify-between text-[10px] text-neutral-500 shrink-0">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>{" "}
                Connected
              </span>
              <span>Workspace: Enterprise</span>
              <span>Last saved: Just now</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Console removed per user request */}
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

export default function Dashboard() {
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
