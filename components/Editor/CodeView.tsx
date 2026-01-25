import React, { useMemo } from "react";
import { useStore } from "../../store";
import { SafetyEngine } from "../../lib/safety-engine";
import {
  schemaToPostgresSQL,
  schemaToMySQL,
  schemaToSQLite,
  schemaToPrisma,
  calculateMigrationDiff,
} from "../../lib/schema-utils";
import {
  Database,
  GitBranch,
  Globe,
  Copy,
  FileJson,
  Download,
  AlertTriangle,
  History,
  FileCode,
  ShieldCheck,
  ChevronRight,
  Rocket,
} from "lucide-react";

export const CodeView = () => {
  const {
    currentSchema,
    baseSchema,
    codeDialect,
    codeViewMode,
    setDialect,
    setCodeViewMode,
    snapshotSchema,
    projects,
    currentProjectId,
  } = useStore();

  const project = projects.find((p) => p.id === currentProjectId);

  const code = useMemo(() => {
    if (codeViewMode === "migration") {
      const steps = calculateMigrationDiff(baseSchema, currentSchema);
      if (steps.length === 0)
        return "-- No changes detected.\n-- Schema is up to date with base.";
      return steps.map((s) => s.sql).join("\n\n");
    }

    switch (codeDialect) {
      case "mysql":
        return schemaToMySQL(currentSchema);
      case "sqlite":
        return schemaToSQLite(currentSchema);
      case "prisma":
        return schemaToPrisma(currentSchema);
      case "postgres":
      default:
        return schemaToPostgresSQL(currentSchema);
    }
  }, [currentSchema, baseSchema, codeDialect, codeViewMode]);

  const hasDestructiveChanges = useMemo(() => {
    if (codeViewMode !== "migration") return false;
    return calculateMigrationDiff(baseSchema, currentSchema).some(
      (s) => s.isDestructive
    );
  }, [baseSchema, currentSchema, codeViewMode]);

  const handleCopy = () => {
    if (hasDestructiveChanges) {
      if (
        !confirm(
          "⚠️ This migration contains destructive changes (DROP or ALTER). Are you sure you want to copy it?"
        )
      )
        return;
    }
    navigator.clipboard.writeText(code);
    alert("SQL copied to clipboard!");
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-950 animate-in fade-in duration-500">
      {/* 1. Context Header */}
      <div className="px-8 py-4 bg-neutral-900/50 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div
            className="flex items-center gap-2 group cursor-help"
            title="Target Database Engine"
          >
            <Database className="w-4 h-4 text-blue-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-tighter">
                Target
              </span>
              <span className="text-xs font-bold text-neutral-200">
                {codeDialect === "postgres"
                  ? "PostgreSQL 15"
                  : codeDialect === "mysql"
                    ? "MySQL 8.0"
                    : codeDialect === "sqlite"
                      ? "SQLite 3"
                      : "Prisma Schema"}
              </span>
            </div>
          </div>
          <div className="w-px h-6 bg-neutral-800" />
          <div
            className="flex items-center gap-2 group cursor-help"
            title="Current Active Branch"
          >
            <GitBranch className="w-4 h-4 text-purple-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-tighter">
                Branch
              </span>
              <span className="text-xs font-bold text-neutral-200">main</span>
            </div>
          </div>
          <div className="w-px h-6 bg-neutral-800" />
          <div
            className="flex items-center gap-2 group cursor-help"
            title="Target Environment"
          >
            <Globe className="w-4 h-4 text-green-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-tighter">
                Environment
              </span>
              <span className="text-xs font-bold text-neutral-200">
                {currentSchema.tables.length > 0 ? "Development" : "Production"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] text-neutral-500 uppercase font-bold block">
              Generated
            </span>
            <span className="text-xs font-mono text-neutral-400">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
          <button
            onClick={() => {
              snapshotSchema();
              alert(
                "Deployment started! Changes are being applied to the staging environment."
              );
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded uppercase transition-all shadow-lg shadow-blue-500/20"
          >
            <Rocket className="w-3.5 h-3.5" /> Deploy Schema
          </button>
        </div>
      </div>

      {/* 2. Control Bar */}
      <div className="px-8 py-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/20">
        <div className="flex items-center gap-4">
          <div className="flex bg-neutral-900 p-1 rounded-lg border border-neutral-800">
            {(["postgres", "mysql", "sqlite", "prisma"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDialect(d)}
                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${codeDialect === d
                    ? "bg-neutral-800 text-white shadow-lg"
                    : "text-neutral-500 hover:text-neutral-300"
                  }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="w-px h-4 bg-neutral-800" />

          <div className="flex bg-neutral-900 p-1 rounded-lg border border-neutral-800">
            <button
              onClick={() => setCodeViewMode("full")}
              className={`flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${codeViewMode === "full"
                  ? "bg-neutral-800 text-white shadow-lg"
                  : "text-neutral-500 hover:text-neutral-300"
                }`}
            >
              <FileCode className="w-3 h-3" /> Full Schema
            </button>
            <button
              onClick={() => setCodeViewMode("migration")}
              className={`flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${codeViewMode === "migration"
                  ? "bg-neutral-800 text-white shadow-lg"
                  : "text-neutral-500 hover:text-neutral-300"
                }`}
            >
              <History className="w-3 h-3" /> Migration Diff
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const blob = new Blob([code], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `schema_${new Date().toISOString().split('T')[0]}.${codeDialect === 'prisma' ? 'prisma' : 'sql'}`;
              a.click();
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-[10px] font-bold rounded uppercase hover:bg-neutral-800 transition-colors text-neutral-300"
          >
            <Download className="w-3.5 h-3.5" /> Download {codeDialect === 'prisma' ? 'Schema' : 'SQL'}
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 text-neutral-900 text-[10px] font-bold rounded uppercase hover:bg-white transition-colors"
          >
            <Copy className="w-3.5 h-3.5" /> Copy Code
          </button>
        </div>
      </div>

      {/* 3. Code Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Risk Gutter (Migration Mode only) */}
        {codeViewMode === "migration" && (
          <div className="w-12 bg-neutral-900/30 border-r border-neutral-800 flex flex-col items-center py-4 gap-4">
            {calculateMigrationDiff(baseSchema, currentSchema).map(
              (step, idx) => (
                <div
                  key={idx}
                  title={
                    step.isDestructive ? "Destructive Change" : "Safe Change"
                  }
                >
                  {step.isDestructive ? (
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-green-500/50" />
                  )}
                </div>
              )
            )}
          </div>
        )}

        {/* Code Content */}
        <div className="flex-1 overflow-auto bg-[#050505] p-8 font-mono text-sm relative group">
          {hasDestructiveChanges && (
            <div className="absolute top-4 right-8 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded flex items-center gap-2 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest leading-none">
                Destructive changes detected
              </span>
            </div>
          )}

          <pre className="text-neutral-400 selection:bg-blue-500/30">
            {code.split("\n").map((line, i) => {
              const isDestructive =
                line.includes("DESTRUCTIVE") || line.includes("⚠️");
              const isAddition =
                line.startsWith("CREATE") || line.startsWith("ADD");
              const isRemoval =
                line.includes("DROP") || line.includes("REMOVE");

              let colors = "text-neutral-400";
              if (isDestructive) colors = "text-orange-400 font-bold";
              else if (isAddition) colors = "text-green-400/80";
              else if (isRemoval) colors = "text-red-400/80";

              return (
                <div
                  key={i}
                  className={`py-0.5 px-2 -mx-2 hover:bg-white/5 rounded transition-colors ${isDestructive
                      ? "bg-orange-500/5 ring-1 ring-orange-500/10"
                      : ""
                    }`}
                >
                  <span className="inline-block w-8 text-neutral-700 text-[10px] select-none text-right mr-4">
                    {i + 1}
                  </span>
                  <span className={colors}>{line}</span>
                </div>
              );
            })}
          </pre>
        </div>

        {/* Sidebar Info - Logic Summary */}
        <div className="w-64 bg-neutral-900/30 border-l border-neutral-800 p-6 space-y-6">
          <div>
            <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">
              Schema Stats
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Tables</span>
                <span className="text-xs font-bold text-white">
                  {currentSchema.tables.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Relationships</span>
                <span className="text-xs font-bold text-white">
                  {currentSchema.relationships.length}
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-neutral-800" />

          <div>
            <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">
              Security Policies
            </h3>
            {(() => {
              const unsecuredCount = currentSchema.tables.filter((t) => {
                const analysis = SafetyEngine.analyzeTable(
                  t,
                  currentSchema.relationships
                );
                return (
                  analysis.risk === "critical" ||
                  analysis.deployStatus !== "safe"
                );
              }).length;

              const isSecure = unsecuredCount === 0;

              return (
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg border ${isSecure
                    ? "bg-green-500/10 border-green-500/20"
                    : "bg-red-500/10 border-red-500/20"
                    }`}
                >
                  {isSecure ? (
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={`text-xs font-medium ${isSecure ? "text-green-500" : "text-red-500"
                      }`}
                  >
                    {isSecure
                      ? "All Tables Protected"
                      : `${unsecuredCount} Unprotected Tables`}
                  </span>
                </div>
              );
            })()}
          </div>

          <div className="h-px bg-neutral-800" />

          <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
            <p className="text-[11px] text-blue-400 leading-relaxed italic">
              "This view represents the read-only canonical output of your
              schema decisions. Use this for audit and export."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
