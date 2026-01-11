import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { Table } from "../../types";
import { useStore } from "../../store";
import { Key, Hash, Calendar, Type, Trash2 } from "lucide-react";

export const TableNode = memo(
  ({ data, selected }: { data: Table; selected: boolean }) => {
    const { selectTable, removeTable } = useStore();

    const getIcon = (type: string) => {
      if (type === "uuid") return <Key className="w-3 h-3 text-blue-400" />;
      if (type.includes("int"))
        return <Hash className="w-3 h-3 text-orange-400" />;
      if (type === "timestamp")
        return <Calendar className="w-3 h-3 text-green-400" />;
      return <Type className="w-3 h-3 text-neutral-400" />;
    };

    return (
      <div
        className={`min-w-[200px] border shadow-2xl transition-all group/node ${
          selected
            ? "border-blue-500 ring-2 ring-blue-500/20"
            : "border-neutral-800"
        }`}
        onClick={() => selectTable(data.id)}
      >
        <div className="bg-neutral-900 px-3 py-2 border-b border-neutral-800 flex items-center justify-between rounded-t-lg">
          <span className="text-xs font-bold text-neutral-100 uppercase tracking-wider">
            {data.name}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeTable(data.id);
              }}
              className="opacity-0 group-hover/node:opacity-100 p-1 hover:bg-neutral-800 rounded transition-all text-neutral-500 hover:text-red-500"
            >
              <Trash2 className="w-3 h-3" />
            </button>
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          </div>
        </div>
        <div className="p-0 bg-neutral-950/50 rounded-b-lg">
          {data.columns.map((col) => (
            <div
              key={col.id}
              className="relative flex items-center justify-between px-3 py-2 border-b border-neutral-900 last:border-0 hover:bg-neutral-900/50 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Handle
                  type="target"
                  position={Position.Left}
                  id={`${data.id}-${col.name}-in`}
                  className="!bg-neutral-700 !border-neutral-800 !w-2 !h-2 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                {getIcon(col.type)}
                <span
                  className={`text-[11px] font-medium ${
                    col.isPrimaryKey ? "text-blue-200" : "text-neutral-400"
                  }`}
                >
                  {col.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-neutral-600 font-mono uppercase">
                  {col.type}
                </span>
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`${data.id}-${col.name}-out`}
                  className="!bg-neutral-700 !border-neutral-800 !w-2 !h-2 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

TableNode.displayName = "TableNode";
