
import { create } from 'zustand';
import { CanonicalSchema, Table, Column, Relationship } from './types';

export type ViewType = 'overview' | 'editor' | 'code' | 'rls' | 'monitoring' | 'logs';

interface AppState {
  currentSchema: CanonicalSchema;
  selectedTableId: string | null;
  currentView: ViewType;
  isAIPanelOpen: boolean;
  isMigrationPreviewOpen: boolean;
  isSettingsOpen: boolean;
  isConsoleOpen: boolean;
  isDeploying: boolean;
  
  // Actions
  setSchema: (schema: CanonicalSchema) => void;
  selectTable: (id: string | null) => void;
  setView: (view: ViewType) => void;
  updateTable: (tableId: string, updates: Partial<Table>) => void;
  addColumn: (tableId: string, column: Column) => void;
  removeColumn: (tableId: string, columnId: string) => void;
  toggleAIPanel: () => void;
  toggleMigrationPreview: () => void;
  setSettingsOpen: (open: boolean) => void;
  setConsoleOpen: (open: boolean) => void;
  setDeploying: (deploying: boolean) => void;
}

const initialSchema: CanonicalSchema = {
  version: '1.0.0',
  tables: [
    {
      id: 'users',
      name: 'users',
      position: { x: 100, y: 100 },
      columns: [
        { id: '1', name: 'id', type: 'uuid', isNullable: false, isPrimaryKey: true },
        { id: '2', name: 'email', type: 'varchar', isNullable: false, isPrimaryKey: false, isUnique: true },
        { id: '3', name: 'created_at', type: 'timestamp', isNullable: false, isPrimaryKey: false, defaultValue: 'now()' }
      ]
    },
    {
      id: 'posts',
      name: 'posts',
      position: { x: 450, y: 150 },
      columns: [
        { id: '4', name: 'id', type: 'uuid', isNullable: false, isPrimaryKey: true },
        { id: '5', name: 'author_id', type: 'uuid', isNullable: false, isPrimaryKey: false },
        { id: '6', name: 'title', type: 'text', isNullable: false, isPrimaryKey: false },
        { id: '7', name: 'content', type: 'jsonb', isNullable: true, isPrimaryKey: false }
      ]
    }
  ],
  relationships: [
    {
      id: 'rel-1',
      fromTable: 'posts',
      fromColumn: 'author_id',
      toTable: 'users',
      toColumn: 'id',
      type: 'one-to-many'
    }
  ]
};

export const useStore = create<AppState>((set) => ({
  currentSchema: initialSchema,
  selectedTableId: null,
  currentView: 'editor',
  isAIPanelOpen: false,
  isMigrationPreviewOpen: false,
  isSettingsOpen: false,
  isConsoleOpen: false,
  isDeploying: false,

  setSchema: (schema) => set({ currentSchema: schema }),
  selectTable: (id) => set({ selectedTableId: id }),
  setView: (view) => set({ currentView: view }),
  updateTable: (tableId, updates) => set((state) => ({
    currentSchema: {
      ...state.currentSchema,
      tables: state.currentSchema.tables.map((t) => 
        t.id === tableId ? { ...t, ...updates } : t
      )
    }
  })),
  addColumn: (tableId, column) => set((state) => ({
    currentSchema: {
      ...state.currentSchema,
      tables: state.currentSchema.tables.map((t) => 
        t.id === tableId ? { ...t, columns: [...t.columns, column] } : t
      )
    }
  })),
  removeColumn: (tableId, columnId) => set((state) => ({
    currentSchema: {
      ...state.currentSchema,
      tables: state.currentSchema.tables.map((t) => 
        t.id === tableId ? { ...t, columns: t.columns.filter(c => c.id !== columnId) } : t
      )
    }
  })),
  toggleAIPanel: () => set((state) => ({ isAIPanelOpen: !state.isAIPanelOpen })),
  toggleMigrationPreview: () => set((state) => ({ isMigrationPreviewOpen: !state.isMigrationPreviewOpen })),
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),
  setConsoleOpen: (open) => set({ isConsoleOpen: open }),
  setDeploying: (deploying) => set({ isDeploying: deploying }),
}));
