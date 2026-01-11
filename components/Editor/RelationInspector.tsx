import React from "react";
import { useStore } from "../../store";
import {
  Link2,
  Trash2,
  X,
  AlertTriangle,
  Fingerprint,
  Anchor,
} from "lucide-react";
import { RelationAction } from "../../types";

export const RelationInspector: React.FC = () => {
  const {
    selectedRelationshipId,
    currentSchema,
    selectRelationship,
    updateRelationship,
  } = useStore();

  const relationship = currentSchema.relationships.find(
    (r) => r.id === selectedRelationshipId
  );
  if (!relationship) return null;

  const fromTable = currentSchema.tables.find(
    (t) => t.id === relationship.fromTable
  );
  const toTable = currentSchema.tables.find(
    (t) => t.id === relationship.toTable
  );

  const actions: RelationAction[] = [
    "CASCADE",
    "SET NULL",
    "RESTRICT",
    "NO ACTION",
  ];

  return (
    <div className="absolute top-4 left-4 w-80 bg-[#0a0a0a]/95 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-left-4 duration-300">
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 rounded-lg">
            <Link2 className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest">
            Relation Inspector
          </span>
        </div>
        <button
          onClick={() => selectRelationship(null)}
          className="p-1 text-neutral-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* Source -> Target */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-neutral-600 uppercase">
                Source
              </p>
              <p className="text-sm font-bold text-white">
                {fromTable?.name}.{relationship.fromColumn}
              </p>
            </div>
            <div className="text-neutral-700">→</div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] font-bold text-neutral-600 uppercase">
                Target
              </p>
              <p className="text-sm font-bold text-white">
                {toTable?.name}.{relationship.toColumn}
              </p>
            </div>
          </div>
        </div>

        <div className="h-px bg-neutral-800/50"></div>

        {/* Configuration */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-500 uppercase flex items-center gap-1.5">
              <Fingerprint className="w-3 h-3" /> Cardinality
            </label>
            <select
              value={relationship.type}
              onChange={(e) =>
                updateRelationship(relationship.id, {
                  type: e.target.value as any,
                })
              }
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:ring-1 focus:ring-blue-500 outline-none"
            >
              <option value="one-to-many">One to Many (1:N)</option>
              <option value="one-to-one">One to One (1:1)</option>
              <option value="many-to-many">Many to Many (M:N)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-500 uppercase flex items-center gap-1.5">
              <Anchor className="w-3 h-3" /> On Delete
            </label>
            <select
              value={relationship.onDelete}
              onChange={(e) =>
                updateRelationship(relationship.id, {
                  onDelete: e.target.value as RelationAction,
                })
              }
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:ring-1 focus:ring-blue-500 outline-none"
            >
              {actions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <p className="text-[9px] text-neutral-500 leading-relaxed italic">
              {relationship.onDelete === "CASCADE"
                ? "Deleting the parent will delete all children."
                : "Restricts deletion if children exist."}
            </p>
          </div>
        </div>

        {/* Risks */}
        <div className="p-3 bg-orange-500/5 border border-orange-500/10 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-orange-500">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase">
              Design Alert
            </span>
          </div>
          <p className="text-[10px] text-neutral-400 leading-relaxed">
            Missing index on{" "}
            <span className="text-neutral-200">
              {fromTable?.name}.{relationship.fromColumn}
            </span>
            . This will cause slow joins as the table grows.
          </p>
          <button className="text-[10px] font-bold text-blue-500 hover:text-blue-400 uppercase tracking-tight">
            Add Index Suggestion
          </button>
        </div>

        <button className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 group">
          <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Delete Relationship
        </button>
      </div>
    </div>
  );
};
