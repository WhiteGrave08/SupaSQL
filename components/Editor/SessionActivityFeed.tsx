import React from "react";
import { useStore } from "../../store";
import { History, Zap, Sparkles, Clock } from "lucide-react";

export const SessionActivityFeed: React.FC = () => {
  const { sessionLogs } = useStore();

  return (
    <div className="flex-1 h-full flex flex-col bg-[#0a0a0a]">
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/20">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-500" />
          <h2 className="font-bold text-xs uppercase tracking-tight text-neutral-200">
            Session Activity
          </h2>
        </div>
        <div className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[8px] font-bold uppercase border border-emerald-500/20">
          Live feed
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {sessionLogs.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-8 h-8 text-neutral-800 mx-auto mb-3 opacity-20" />
            <p className="text-xs text-neutral-600 italic">
              No changes recorded in this session.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {sessionLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 hover:bg-white/5 rounded-xl transition-colors group cursor-default"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                      log.action.includes("ADD")
                        ? "bg-green-500 shadow-sm shadow-green-500/50"
                        : "bg-blue-500 shadow-sm shadow-blue-500/50"
                    }`}
                  ></div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-neutral-200 leading-tight uppercase tracking-tighter">
                      {log.action.replace(/_/g, " ")}
                    </p>
                    <p className="text-[11px] text-neutral-500 font-medium">
                      {log.item_name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-neutral-800 bg-neutral-900/20">
        <div className="flex items-center gap-2 p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <p className="text-[10px] font-medium text-blue-300 leading-normal">
            AI is monitoring your design patterns for optimizations and
            consistency.
          </p>
        </div>
      </div>
    </div>
  );
};
