
import React, { useCallback, useMemo, useEffect, useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Panel,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge
} from 'reactflow';

import { useStore, ViewType } from './store';
import { TableNode } from './components/Editor/TableNode';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AIPanel } from './components/Editor/AIPanel';
import { PropertiesPanel } from './components/Editor/PropertiesPanel';
import { 
  Sparkles, Terminal, FileCode, CheckCircle2, ChevronUp, 
  ChevronDown, Database, Cpu, HardDrive, ShieldAlert,
  Search, Lock, ExternalLink, RefreshCcw, Loader2
} from 'lucide-react';
import { schemaToPostgresSQL } from './lib/schema-utils';

const nodeTypes = {
  tableNode: TableNode
};

// --- DUMMY VIEW COMPONENTS ---

const OverviewView = () => {
  const { currentSchema } = useStore();
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto overflow-y-auto h-full custom-scrollbar">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Project Overview</h1>
        <p className="text-neutral-500 text-sm">Real-time health and statistics for your SupaSQL cluster.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Database, label: 'Tables', value: currentSchema.tables.length, trend: '+2 this week' },
          { icon: Cpu, label: 'CPU Usage', value: '12.4%', trend: 'Healthy' },
          { icon: HardDrive, label: 'Storage', value: '1.2 GB / 50 GB', trend: '2% used' }
        ].map((stat, i) => (
          <div key={i} className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-neutral-800 rounded-lg"><stat.icon className="w-5 h-5 text-blue-500" /></div>
              <span className="text-sm font-medium text-neutral-400">{stat.label}</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-[10px] text-green-500 font-medium uppercase tracking-wider">{stat.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl">
          <h3 className="text-sm font-bold text-neutral-200 mb-4 flex items-center gap-2">
            <RefreshCcw className="w-4 h-4 text-neutral-500" /> Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              { action: 'Updated Table', item: 'users', time: '12 mins ago' },
              { action: 'Deployed Migration', item: 'add_auth_provider', time: '2 hours ago' },
              { action: 'AI Suggestion', item: 'Index optimization', time: 'Yesterday' }
            ].map((act, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-neutral-800 last:border-0">
                <span className="text-neutral-400">{act.action}</span>
                <span className="font-mono text-neutral-200">{act.item}</span>
                <span className="text-neutral-600">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-sm font-bold text-neutral-200 mb-1">Security Health Check</h3>
          <p className="text-xs text-neutral-500 mb-4 max-w-[240px]">You have 2 tables without Row Level Security enabled.</p>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-md transition-colors">Review RLS Policies</button>
        </div>
      </div>
    </div>
  );
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
         <div key={i} className="flex-1 bg-blue-500/30 border-t border-blue-500" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
       ))}
       <div className="absolute top-4 left-4 text-[10px] text-neutral-600 uppercase font-bold">Database Reads / s</div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {['Avg Latency', 'Error Rate', 'Active Conn', 'Cache Hit'].map((l, i) => (
        <div key={i} className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
          <div className="text-[10px] text-neutral-500 uppercase font-bold mb-1">{l}</div>
          <div className="text-lg font-bold">{(Math.random() * 10).toFixed(2)}{i === 1 ? '%' : 'ms'}</div>
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
        {currentSchema.tables.map(table => (
          <div key={table.id} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${table.name === 'users' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                <Lock className={`w-4 h-4 ${table.name === 'users' ? 'text-green-500' : 'text-red-500'}`} />
              </div>
              <div>
                <h4 className="text-sm font-semibold">{table.name}</h4>
                <p className="text-[10px] text-neutral-500">{table.name === 'users' ? 'Protected by 2 policies' : 'No policies defined. WARNING: Data is public.'}</p>
              </div>
            </div>
            <button className="text-xs font-bold text-blue-500 hover:text-blue-400">Manage Policies</button>
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
              {[1,2,3,4,5,6].map(i => (
                 <tr key={i} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="px-4 py-3 text-neutral-500 font-mono">2023-10-27 14:2{i}:12</td>
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
  const [history, setHistory] = useState(['Connected to SupaSQL-Main...', 'Ready for commands. Try "SELECT * FROM users;"']);
  const [input, setInput] = useState('');

  if (!isConsoleOpen) return null;

  return (
    <div className="h-64 border-t border-neutral-800 bg-[#0a0a0a] flex flex-col z-40">
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-900/50 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Interactive SQL Console</span>
        </div>
        <button onClick={() => setConsoleOpen(false)}><ChevronDown className="w-4 h-4 text-neutral-500" /></button>
      </div>
      <div className="flex-1 p-4 font-mono text-[11px] overflow-y-auto custom-scrollbar">
         {history.map((h, i) => <div key={i} className="mb-1"><span className="text-blue-500 mr-2">❯</span> {h}</div>)}
         <div className="flex items-center gap-2">
            <span className="text-blue-500">❯</span>
            <input 
              autoFocus
              className="bg-transparent outline-none flex-1 text-white" 
              value={input} 
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && input) {
                  setHistory([...history, input, `Executed locally: [OK]`]);
                  setInput('');
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
          <button onClick={() => setSettingsOpen(false)} className="p-2 hover:bg-neutral-800 rounded-md">×</button>
        </div>
        <div className="p-6 grid grid-cols-4 gap-6">
          <div className="col-span-1 space-y-1">
             {['General', 'Database', 'Auth', 'API Keys', 'Billing'].map((t, i) => (
               <div key={i} className={`px-3 py-2 rounded-md text-sm cursor-pointer ${i === 0 ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-500 hover:text-white'}`}>{t}</div>
             ))}
          </div>
          <div className="col-span-3 space-y-6">
             <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase">Project Name</label>
                <input className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm" placeholder="SupaSQL Production" />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase">Primary Region</label>
                <select className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm">
                   <option>us-east-1 (N. Virginia)</option>
                   <option>eu-west-1 (Ireland)</option>
                </select>
             </div>
             <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
                <button onClick={() => setSettingsOpen(false)} className="px-4 py-2 text-xs font-bold text-neutral-400 hover:text-white transition-colors">Cancel</button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-md transition-colors">Save Changes</button>
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
        setStep(s => {
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
    'Validating DDL changes...',
    'Generating migration plan...',
    'Executing SQL on target nodes...',
    'Finished! Cluster updated.'
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
             <h3 className="font-bold text-lg">{step < 3 ? 'Deploying Changes' : 'Deployment Complete'}</h3>
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
  const { 
    currentSchema, 
    isAIPanelOpen, 
    toggleAIPanel, 
    isMigrationPreviewOpen, 
    toggleMigrationPreview,
    currentView,
    isConsoleOpen,
    setConsoleOpen
  } = useStore();
  
  const initialNodes = useMemo(() => 
    currentSchema.tables.map(table => ({
      id: table.id,
      type: 'tableNode',
      position: table.position,
      data: table
    })), [currentSchema.tables]);

  const initialEdges = useMemo(() => 
    currentSchema.relationships.map(rel => ({
      id: rel.id,
      source: rel.fromTable,
      sourceHandle: `${rel.fromTable}-${rel.fromColumn}-out`,
      target: rel.toTable,
      targetHandle: `${rel.toTable}-${rel.toColumn}-in`,
      animated: true,
      label: rel.type
    })), [currentSchema.relationships]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [currentSchema, initialNodes, initialEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const sqlPreview = useMemo(() => schemaToPostgresSQL(currentSchema), [currentSchema]);

  const renderContent = () => {
    switch(currentView) {
      case 'overview': return <OverviewView />;
      case 'monitoring': return <MonitoringView />;
      case 'rls': return <RlsPoliciesView />;
      case 'logs': return <LogsView />;
      case 'code': return (
        <div className="p-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold">Schema Code</h1>
            <div className="flex items-center gap-2">
               <button className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-[10px] font-bold rounded uppercase hover:bg-neutral-800 transition-colors">Export JSON</button>
               <button className="px-3 py-1.5 bg-neutral-100 text-neutral-900 text-[10px] font-bold rounded uppercase hover:bg-white transition-colors">Copy SQL</button>
            </div>
          </div>
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-6 font-mono text-sm text-neutral-400 overflow-auto max-h-[70vh]">
            <pre>{sqlPreview}</pre>
          </div>
        </div>
      );
      case 'editor':
      default:
        return (
          <div className="flex-1 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              className="bg-dot-pattern"
            >
              <Background color="#1a1a1a" gap={20} />
              <Controls className="!bg-neutral-900 !border-neutral-800 !shadow-xl" />
              
              <Panel position="bottom-center" className="mb-6">
                <div className="flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-full px-4 py-2 shadow-2xl">
                  <button 
                    onClick={toggleAIPanel}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      isAIPanelOpen ? 'bg-blue-600 text-white' : 'hover:bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Assistant
                  </button>
                  <div className="w-px h-4 bg-neutral-700 mx-1"></div>
                  <button 
                    onClick={toggleMigrationPreview}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        isMigrationPreviewOpen ? 'bg-neutral-200 text-neutral-900' : 'hover:bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    SQL Preview
                  </button>
                </div>
              </Panel>

              {isMigrationPreviewOpen && (
                <Panel position="bottom-right" className="mb-20 mr-4 w-[500px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-neutral-800 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
                  <div className="p-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50">
                    <div className="flex items-center gap-2">
                       <Terminal className="w-4 h-4 text-blue-400" />
                       <span className="text-xs font-bold text-neutral-300 uppercase">Postgres DDL Output</span>
                    </div>
                    <button onClick={toggleMigrationPreview} className="text-neutral-500 hover:text-white">×</button>
                  </div>
                  <pre className="p-4 text-[11px] font-mono text-neutral-400 max-h-[400px] overflow-auto leading-relaxed scrollbar-thin scrollbar-thumb-neutral-800">
                    <code>{sqlPreview}</code>
                  </pre>
                  <div className="p-3 bg-neutral-900/30 border-t border-neutral-800 flex items-center justify-between">
                     <div className="flex items-center gap-2 text-[10px] text-green-500">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>SQL is valid</span>
                     </div>
                     <button className="px-3 py-1 bg-neutral-100 text-neutral-900 text-[10px] font-bold rounded uppercase hover:bg-white transition-colors">
                        Copy to Clipboard
                     </button>
                  </div>
                </Panel>
              )}
            </ReactFlow>
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
          <div className="flex-1 overflow-hidden">
            {renderContent()}
          </div>

          <ConsoleDrawer />

          <div className="h-8 border-t border-neutral-800 bg-[#0a0a0a] px-4 flex items-center justify-between text-[10px] text-neutral-500 shrink-0">
             <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Connected</span>
                <span>Workspace: Enterprise</span>
                <span>Last saved: 2m ago</span>
             </div>
             <div className="flex items-center gap-3">
                <button 
                  onClick={() => setConsoleOpen(!isConsoleOpen)}
                  className="hover:text-neutral-300 flex items-center gap-1"
                >
                  {isConsoleOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                  Console
                </button>
             </div>
          </div>
        </main>

        {currentView === 'editor' && <PropertiesPanel />}
        {(currentView === 'editor' && isAIPanelOpen) && <AIPanel />}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <Editor />
    </ReactFlowProvider>
  );
}
