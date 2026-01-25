import React, { useState } from "react";
import { useStore, semanticToSql } from "../../store";
import {
  Trash2,
  Plus,
  ArrowRight,
  Shield,
  Sparkles,
  AlertTriangle,
  Fingerprint,
  Info,
} from "lucide-react";
import { SemanticType } from "../../types";

export const PropertiesPanel: React.FC = () => {
  const {
    selectedTableId,
    currentSchema,
    updateTable,
    addColumn,
    updateColumn,
    removeColumn,
    selectTable,
  } = useStore();

  const [showSemanticInfo, setShowSemanticInfo] = useState<string | null>(null);
  const [localTableName, setLocalTableName] = useState(selectedTableId ? currentSchema.tables.find(t => t.id === selectedTableId)?.name || "" : "");

  // Update local name when selection changes
  React.useEffect(() => {
    if (selectedTableId) {
      const t = currentSchema.tables.find(t => t.id === selectedTableId);
      if (t) setLocalTableName(t.name);
    }
  }, [selectedTableId, currentSchema.tables]);

  // Debounce update
  React.useEffect(() => {
    if (!selectedTableId) return;
    const t = currentSchema.tables.find(t => t.id === selectedTableId);
    if (t && localTableName !== t.name) {
      const timer = setTimeout(() => {
        updateTable(selectedTableId, { name: localTableName });
      }, 3000); // 3 seconds debounce
      return () => clearTimeout(timer);
    }
  }, [localTableName, selectedTableId]);

  const selectedTable = currentSchema.tables.find(
    (t) => t.id === selectedTableId
  );

  if (!selectedTable) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-neutral-600 p-8 text-center bg-[#0a0a0a]">
        <div className="p-4 bg-neutral-900/50 rounded-2xl border border-neutral-800 mb-4 text-neutral-500">
          <Fingerprint className="w-8 h-8 opacity-20 mx-auto" />
        </div>
        <p className="text-sm font-medium">Select a table to view properties</p>
        <p className="text-[10px] uppercase tracking-widest mt-2 opacity-50">
          Decision Workspace
        </p>
      </div>
    );
  }

  const semanticTypes: SemanticType[] = [
    "none",
    "email",
    "username",
    "password_hash",
    "currency",
    "timestamp_created",
    "timestamp_updated",
    "soft_delete",
    "slug",
    "url",
  ];

  return (
    <div className="flex-1 h-full flex flex-col bg-[#0a0a0a]">
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></div>
          <h2 className="font-bold text-xs uppercase tracking-tight">
            Table: {selectedTable.name}
          </h2>
        </div>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        <section className="space-y-4">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
            General
          </label>
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-neutral-600 uppercase">
              Table Name
            </span>
            <input
              type="text"
              value={localTableName}
              onChange={(e) => setLocalTableName(e.target.value)}
              className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-white transition-all"
            />
          </div>
        </section>

        <div className="h-px bg-neutral-800/50"></div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              Column Decisions
            </label>
            <button
              onClick={() =>
                addColumn(selectedTable.id, {
                  id: `col_${Date.now()}`,
                  name: "new_col",
                  type: "text",
                  isNullable: true,
                  isPrimaryKey: false,
                })
              }
              className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 text-[10px] font-bold rounded-md flex items-center gap-1 transition-all border border-blue-500/20"
            >
              <Plus className="w-3 h-3" /> Add Column
            </button>
          </div>

          <div className="space-y-3">
            {selectedTable.columns.map((col) => (
              <div
                key={col.id}
                className="p-3 bg-neutral-900/30 rounded-2xl border border-neutral-800/50 group hover:border-neutral-700 transition-all hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    value={col.name}
                    onChange={(e) =>
                      updateColumn(selectedTable.id, col.id, {
                        name: e.target.value,
                      })
                    }
                    className="bg-transparent text-xs font-bold text-neutral-200 outline-none w-2/3 focus:text-blue-400 transition-colors"
                  />
                  <div className="flex items-center gap-2">
                    {col.isPrimaryKey && (
                      <Shield
                        className="w-3.5 h-3.5 text-blue-500"
                        title="Primary Key"
                      />
                    )}
                    <button
                      onClick={() => removeColumn(selectedTable.id, col.id)}
                      className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-red-500 transition-all p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-tighter">
                      Semantic Type
                    </span>
                    <select
                      value={col.semanticType || "none"}
                      onChange={(e) => {
                        const semantic = e.target.value as SemanticType;
                        const sqlUpdates = semanticToSql(semantic);
                        updateColumn(selectedTable.id, col.id, {
                          semanticType: semantic,
                          ...sqlUpdates,
                        });
                      }}
                      className="w-full bg-black/40 border border-neutral-800/50 text-[10px] font-semibold rounded-lg px-2 py-1.5 text-blue-400 outline-none focus:ring-1 focus:ring-blue-500/50"
                    >
                      {semanticTypes.map((t) => (
                        <option key={t} value={t}>
                          {t.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-tighter">
                      SQL Type
                    </span>
                    <select
                      value={col.type}
                      onChange={(e) =>
                        updateColumn(selectedTable.id, col.id, {
                          type: e.target.value as any,
                        })
                      }
                      className="w-full bg-black/40 border border-neutral-800/50 text-[10px] font-semibold rounded-lg px-2 py-1.5 text-neutral-400 outline-none focus:ring-1 focus:ring-blue-500/50"
                    >
                      <option value="uuid">UUID</option>
                      <option value="varchar">VARCHAR</option>
                      <option value="text">TEXT</option>
                      <option value="int">INT</option>
                      <option value="bigint">BIGINT</option>
                      <option value="boolean">BOOLEAN</option>
                      <option value="timestamp">TIMESTAMP</option>
                      <option value="jsonb">JSONB</option>
                      <option value="decimal">DECIMAL</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-800/50 pt-2.5">
                  <div
                    className="flex items-center gap-2 cursor-pointer group/opt"
                    onClick={() =>
                      updateColumn(selectedTable.id, col.id, {
                        isNullable: !col.isNullable,
                      })
                    }
                  >
                    <div
                      className={`w-3 h-3 rounded border flex items-center justify-center transition-all ${col.isNullable
                          ? "bg-blue-500 border-blue-500"
                          : "bg-transparent border-neutral-700"
                        }`}
                    >
                      {col.isNullable && (
                        <ArrowRight className="w-2 h-2 text-white rotate-90" />
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase transition-colors ${col.isNullable ? "text-neutral-300" : "text-neutral-600"
                        }`}
                    >
                      Nullable
                    </span>
                  </div>

                  {!col.isNullable && !col.isPrimaryKey && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
                      <AlertTriangle className="w-3 h-3 text-orange-500" />
                      <span className="text-[8px] font-bold text-orange-500 uppercase">
                        Impact: Data Risk
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="pt-6 border-t border-neutral-800">
          <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Shield className="w-12 h-12 text-blue-500" />
            </div>
            <div className="flex flex-col items-start relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                  AI Recommendation
                </span>
              </div>
              <span className="text-xs font-bold text-neutral-200 mb-1">
                Security: RLS Policy Missing
              </span>
              <p className="text-[10px] text-neutral-500 leading-relaxed font-medium mb-3">
                Table <code>{selectedTable.name}</code> has no Row Level Security enabled. This is a critical risk.
              </p>
              <button
                onClick={() => useStore.getState().setView("rls")}
                className="flex items-center gap-1.5 text-[10px] font-bold text-blue-500 hover:text-blue-400 transition-colors"
              >
                <span>ENABLE RLS PROTECTION</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const X: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
