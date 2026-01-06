
import React from 'react';
import { useStore } from '../../store';
import { Trash2, Plus, ArrowRight, Shield } from 'lucide-react';

export const PropertiesPanel: React.FC = () => {
  const { selectedTableId, currentSchema, updateTable, addColumn, removeColumn, selectTable } = useStore();
  const selectedTable = currentSchema.tables.find(t => t.id === selectedTableId);

  if (!selectedTable) {
    return (
      <div className="w-80 border-l border-neutral-800 bg-[#0a0a0a] flex items-center justify-center text-neutral-600 text-sm">
        Select a table to view properties
      </div>
    );
  }

  return (
    <div className="w-80 h-full border-l border-neutral-800 bg-[#0a0a0a] flex flex-col">
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <h2 className="font-semibold text-sm">Table: {selectedTable.name}</h2>
        <button onClick={() => selectTable(null)} className="text-neutral-500">×</button>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        <section className="space-y-3">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">General</label>
          <div className="space-y-1.5">
            <span className="text-[10px] text-neutral-400">Name</span>
            <input 
              type="text" 
              value={selectedTable.name}
              onChange={(e) => updateTable(selectedTable.id, { name: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Columns</label>
            <button 
              onClick={() => addColumn(selectedTable.id, { id: Date.now().toString(), name: 'new_col', type: 'text', isNullable: true, isPrimaryKey: false })}
              className="text-blue-500 hover:text-blue-400 text-[10px] font-semibold flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          
          <div className="space-y-2">
            {selectedTable.columns.map((col) => (
              <div key={col.id} className="p-2 bg-neutral-900/50 rounded border border-neutral-800 group hover:border-neutral-700 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <input 
                    type="text" 
                    value={col.name}
                    className="bg-transparent text-[11px] font-semibold text-neutral-200 outline-none w-2/3"
                  />
                  <div className="flex items-center gap-2">
                    {col.isPrimaryKey && <Shield className="w-3 h-3 text-blue-500" />}
                    <button 
                      onClick={() => removeColumn(selectedTable.id, col.id)}
                      className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <select className="bg-neutral-800 border-none text-[9px] rounded px-1 text-neutral-400">
                      <option value="uuid">UUID</option>
                      <option value="varchar">VARCHAR</option>
                      <option value="text">TEXT</option>
                      <option value="timestamp">TIMESTAMP</option>
                   </select>
                   <div className="flex items-center gap-1">
                      <input type="checkbox" checked={col.isNullable} readOnly className="w-2.5 h-2.5 rounded bg-neutral-800" />
                      <span className="text-[8px] text-neutral-500 uppercase">Nullable</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="pt-6 border-t border-neutral-800">
           <button className="w-full flex items-center justify-between p-3 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors group">
              <div className="flex flex-col items-start">
                 <span className="text-xs font-semibold text-neutral-200">Generate Index</span>
                 <span className="text-[10px] text-neutral-500">Suggested for frequent filters</span>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
           </button>
        </div>
      </div>
    </div>
  );
};
