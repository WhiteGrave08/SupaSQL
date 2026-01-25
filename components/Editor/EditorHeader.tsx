import React, { useState } from "react";
import { useStore } from "../../store";
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Database,
  Zap,
  Fingerprint,
  Sparkles,
  History,
} from "lucide-react";

export const EditorHeader: React.FC = () => {
  const {
    validationIssues,
    currentSchema,
    activeRightPanel,
    setActiveRightPanel,
  } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const errors = validationIssues.filter((i) => i.type === "error");
  const warnings = validationIssues.filter((i) => i.type === "warning");

  const statusColor =
    errors.length > 0
      ? "text-red-500"
      : warnings.length > 0
        ? "text-orange-500"
        : "text-green-500";
  const bgColor =
    errors.length > 0
      ? "bg-red-500/5"
      : warnings.length > 0
        ? "bg-orange-500/5"
        : "bg-green-500/5";
  const borderColor =
    errors.length > 0
      ? "border-red-500/20"
      : warnings.length > 0
        ? "border-orange-500/20"
        : "border-green-500/20";

  return (
    <div
      className={`border-b ${borderColor} ${bgColor} transition-all duration-300`}
    >
      <div className="h-10 px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              Schema Status
            </span>
            <div
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${borderColor} bg-black/20`}
            >
              {errors.length > 0 ? (
                <XCircle className="w-3 h-3 text-red-500" />
              ) : warnings.length > 0 ? (
                <AlertCircle className="w-3 h-3 text-orange-500" />
              ) : (
                <CheckCircle2 className="w-3 h-3 text-green-500" />
              )}
              <span className={`text-[10px] font-bold ${statusColor}`}>
                {errors.length > 0
                  ? `${errors.length} Errors`
                  : warnings.length > 0
                    ? `${warnings.length} Warnings`
                    : "Schema Valid"}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 border-l border-neutral-800/50 pl-6">
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-neutral-400">
              <Database className="w-3 h-3" />
              <span>{currentSchema?.tables?.length || 0} Tables</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-neutral-400">
              <Zap className="w-3 h-3 text-blue-400" />
              <span>Impact: Low Risk</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-black/20 p-1 rounded-lg border border-neutral-800 mr-4">
            <button
              onClick={() => setActiveRightPanel("properties")}
              className={`p-1.5 rounded-md transition-all ${activeRightPanel === "properties"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-neutral-500 hover:text-neutral-300"
                }`}
              title="Table Properties"
            >
              <Fingerprint className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveRightPanel("ai")}
              className={`p-1.5 rounded-md transition-all ${activeRightPanel === "ai"
                  ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                  : "text-neutral-500 hover:text-neutral-300"
                }`}
              title="AI Assistant"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveRightPanel("activity")}
              className={`p-1.5 rounded-md transition-all ${activeRightPanel === "activity"
                  ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                  : "text-neutral-500 hover:text-neutral-300"
                }`}
              title="Session Activity"
            >
              <History className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[10px] font-bold text-neutral-500 hover:text-neutral-300 uppercase tracking-tight"
          >
            {validationIssues.length > 0 ? "View Issues" : "Details"}
            {isExpanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && validationIssues.length > 0 && (
        <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {validationIssues.map((issue) => (
              <div
                key={issue.id}
                className={`p-3 rounded-xl border ${issue.type === "error"
                    ? "bg-red-500/5 border-red-500/10"
                    : "bg-orange-500/5 border-orange-500/10"
                  } flex gap-3`}
              >
                <div className="mt-0.5">
                  {issue.type === "error" ? (
                    <XCircle className="w-4 h-4 text-red-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-200 leading-tight mb-1">
                    {issue.message}
                  </p>
                  <button
                    onClick={() => useStore.getState().setView("rls")}
                    className="text-[10px] font-bold text-blue-500 hover:text-blue-400 uppercase tracking-tighter"
                  >
                    Fix Issue
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isExpanded && validationIssues.length === 0 && (
        <div className="px-4 pb-8 pt-4 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-sm font-bold text-white mb-1">
            Your schema is solid!
          </p>
          <p className="text-xs text-neutral-500">
            Perfectly normalized and ready for production deployment.
          </p>
        </div>
      )}
    </div>
  );
};
