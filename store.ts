
import { create } from 'zustand';
import { CanonicalSchema, Table, Column, Relationship, Project, AuditLog, ValidationIssue, SemanticType } from './types';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';

export type ViewType = 'overview' | 'editor' | 'code' | 'rls' | 'health' | 'logs';

interface AppState {
  user: User | null;
  projects: Project[];
  currentProjectId: string | null;
  currentSchema: CanonicalSchema;
  activityLogs: AuditLog[];
  selectedTableId: string | null;
  currentView: ViewType;
  isAIPanelOpen: boolean;
  isMigrationPreviewOpen: boolean;
  isSettingsOpen: boolean;
  isConsoleOpen: boolean;
  isDeploying: boolean;
  isLoading: boolean;
  error: string | null;
  validationIssues: ValidationIssue[];
  sessionLogs: AuditLog[];
  selectedRelationshipId: string | null;
  activeRightPanel: 'properties' | 'ai' | 'activity' | null;
  codeDialect: 'postgres' | 'mysql' | 'sqlite' | 'prisma';
  codeViewMode: 'full' | 'migration';
  baseSchema: CanonicalSchema;

  // Actions
  checkUser: () => Promise<void>;
  signOut: () => Promise<void>;
  fetchData: () => Promise<void>;
  saveSchema: () => Promise<void>;
  setSchema: (schema: CanonicalSchema) => void;
  selectTable: (id: string | null) => void;
  setView: (view: ViewType) => void;

  // Project operations
  selectProject: (id: string | null) => Promise<void>;
  createProject: (name: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  logActivity: (action: string, itemName: string, details?: any) => Promise<void>;

  // Table operations
  addTable: (name: string, x?: number, y?: number) => void;
  updateTable: (tableId: string, updates: Partial<Table>) => void;
  removeTable: (tableId: string) => void;

  // Column operations
  addColumn: (tableId: string, column: Column) => void;
  updateColumn: (tableId: string, columnId: string, updates: Partial<Column>) => void;
  removeColumn: (tableId: string, columnId: string) => void;

  // UI state toggles
  toggleAIPanel: () => void;
  toggleMigrationPreview: () => void;
  setSettingsOpen: (open: boolean) => void;
  setConsoleOpen: (open: boolean) => void;
  setDeploying: (deploying: boolean) => void;
  selectRelationship: (id: string | null) => void;
  updateRelationship: (id: string, updates: Partial<Relationship>) => void;
  validateSchema: () => void;
  setActiveRightPanel: (panel: 'properties' | 'ai' | 'activity' | null) => void;
  setDialect: (dialect: 'postgres' | 'mysql' | 'sqlite' | 'prisma') => void;
  setCodeViewMode: (mode: 'full' | 'migration') => void;
  snapshotSchema: () => void;
}

const initialSchema: CanonicalSchema = {
  version: '1.0.0',
  tables: [],
  relationships: []
};

export const useStore = create<AppState>((set, get) => ({
  user: null,
  projects: [],
  currentProjectId: null,
  currentSchema: initialSchema,
  activityLogs: [],
  selectedTableId: null,
  currentView: 'overview',
  isAIPanelOpen: false,
  isMigrationPreviewOpen: false,
  isSettingsOpen: false,
  isConsoleOpen: false,
  isDeploying: false,
  isLoading: false,
  error: null,
  validationIssues: [],
  sessionLogs: [],
  selectedRelationshipId: null,
  activeRightPanel: 'properties',
  codeDialect: 'postgres',
  codeViewMode: 'full',
  baseSchema: initialSchema,

  checkUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    set({ user });
    if (user) {
      get().fetchData();
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, projects: [], currentProjectId: null, currentSchema: initialSchema, activityLogs: [] });
  },

  fetchData: async () => {
    const { user } = get();
    if (!user) {
      set({ projects: [], isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const { data: projects, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (projectError) throw projectError;
      set({ projects: projects || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  selectProject: async (id) => {
    if (!id) {
      set({ currentProjectId: null, currentSchema: initialSchema, activityLogs: [] });
      return;
    }
    set({ isLoading: true });
    try {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (projectError) throw projectError;

      const { data: logs, error: logsError } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false })
        .limit(20);

      const schema = project.data as CanonicalSchema;
      set({
        currentProjectId: id,
        currentSchema: {
          ...initialSchema,
          ...schema,
          tables: schema?.tables || [],
          relationships: schema?.relationships || []
        },
        activityLogs: logs || [],
        isLoading: false
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createProject: async (name) => {
    set({ isLoading: true });
    try {
      const { data: userData } = await supabase.auth.getUser();
      const { data: newProject, error: createError } = await supabase
        .from('projects')
        .insert({
          name,
          data: initialSchema,
          user_id: userData?.user?.id
        })
        .select()
        .single();

      if (createError) throw createError;

      const { projects } = get();
      set({
        projects: [newProject, ...projects],
        currentProjectId: newProject.id,
        currentSchema: initialSchema,
        isLoading: false
      });
      get().logActivity('CREATE_PROJECT', name, { message: 'Project initialized' });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  deleteProject: async (id) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const { projects, currentProjectId } = get();
      set({
        projects: projects.filter(p => p.id !== id),
        currentProjectId: currentProjectId === id ? null : currentProjectId
      });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  logActivity: async (action, itemName, details = {}) => {
    const { currentProjectId } = get();
    if (!currentProjectId) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      const { data: log, error } = await supabase
        .from('audit_logs')
        .insert({
          project_id: currentProjectId,
          user_id: userData?.user?.id,
          action,
          item_name: itemName,
          details
        })
        .select()
        .single();

      if (error) throw error;

      set(state => ({ activityLogs: [log, ...state.activityLogs].slice(0, 20) }));
    } catch (err) {
      console.error("Failed to log activity:", err);
    }
  },

  saveSchema: async () => {
    const { currentProjectId, currentSchema } = get();
    if (!currentProjectId) return;

    try {
      const { error } = await supabase
        .from('projects')
        .update({ data: currentSchema, updated_at: new Date().toISOString() })
        .eq('id', currentProjectId);

      if (error) throw error;
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  setSchema: (schema) => {
    set({ currentSchema: schema });
    get().saveSchema();
    get().logActivity('UPDATE_SCHEMA', 'Schema Updated', { version: schema.version });
    get().validateSchema();
  },

  selectTable: (id) => set((state) => ({
    selectedTableId: id,
    activeRightPanel: id ? 'properties' : state.activeRightPanel
  })),
  setView: (view) => set({ currentView: view }),

  addTable: (name, x = 100, y = 100) => {
    const newTable: Table = {
      id: `table_${Date.now()}`,
      name,
      position: { x, y },
      policies: [],
      columns: [
        { id: `col_${Date.now()}`, name: 'id', type: 'uuid', isPrimaryKey: true, isNullable: false }
      ]
    };
    set((state) => ({
      currentSchema: {
        ...state.currentSchema,
        tables: [...state.currentSchema.tables, newTable]
      },
      sessionLogs: [{
        id: `log_${Date.now()}`,
        project_id: state.currentProjectId!,
        user_id: state.user?.id!,
        action: 'ADD_TABLE',
        item_name: name,
        details: {},
        created_at: new Date().toISOString()
      }, ...state.sessionLogs]
    }));
    get().saveSchema();
    get().logActivity('ADD_TABLE', name, { x, y });
    get().validateSchema();
  },

  updateTable: (tableId, updates) => {
    const table = get().currentSchema.tables.find(t => t.id === tableId);
    set((state) => {
      const newLogs = updates.name && updates.name !== table?.name ? [{
        id: `log_${Date.now()}`,
        project_id: state.currentProjectId!,
        user_id: state.user?.id!,
        action: 'RENAME_TABLE',
        item_name: `${table?.name} -> ${updates.name}`,
        details: {},
        created_at: new Date().toISOString()
      }, ...state.sessionLogs] : state.sessionLogs;

      return {
        currentSchema: {
          ...state.currentSchema,
          tables: state.currentSchema.tables.map((t) =>
            t.id === tableId ? { ...t, ...updates } : t
          )
        },
        sessionLogs: newLogs
      };
    });
    get().saveSchema();
    if (updates.name && table && updates.name !== table.name) {
      get().logActivity('RENAME_TABLE', updates.name, { oldName: table.name });
    }
    get().validateSchema();
  },

  removeTable: (tableId) => {
    const table = get().currentSchema.tables.find(t => t.id === tableId);
    set((state) => ({
      currentSchema: {
        ...state.currentSchema,
        tables: state.currentSchema.tables.filter((t) => t.id !== tableId),
        relationships: state.currentSchema.relationships.filter(
          (r) => r.fromTable !== tableId && r.toTable !== tableId
        )
      },
      selectedTableId: state.selectedTableId === tableId ? null : state.selectedTableId,
      sessionLogs: [{
        id: `log_${Date.now()}`,
        project_id: state.currentProjectId!,
        user_id: state.user?.id!,
        action: 'REMOVE_TABLE',
        item_name: table?.name || 'Unknown Table',
        details: {},
        created_at: new Date().toISOString()
      }, ...state.sessionLogs]
    }));
    get().saveSchema();
    if (table) get().logActivity('REMOVE_TABLE', table.name);
    get().validateSchema();
  },

  addColumn: (tableId, column) => {
    const table = get().currentSchema.tables.find(t => t.id === tableId);
    set((state) => ({
      currentSchema: {
        ...state.currentSchema,
        tables: state.currentSchema.tables.map((t) =>
          t.id === tableId ? { ...t, columns: [...t.columns, column] } : t
        )
      },
      sessionLogs: [{
        id: `log_${Date.now()}`,
        project_id: state.currentProjectId!,
        user_id: state.user?.id!,
        action: 'ADD_COLUMN',
        item_name: `${table?.name}.${column.name}`,
        details: {},
        created_at: new Date().toISOString()
      }, ...state.sessionLogs]
    }));
    get().saveSchema();
    if (table) get().logActivity('ADD_COLUMN', column.name, { table: table.name });
    get().validateSchema();
  },

  updateColumn: (tableId, columnId, updates) => {
    set((state) => {
      const table = state.currentSchema.tables.find(t => t.id === tableId);
      const column = table?.columns.find(c => c.id === columnId);

      const newLogs = [...state.sessionLogs];
      if (updates.name && updates.name !== column?.name) {
        newLogs.unshift({
          id: `log_${Date.now()}`,
          project_id: state.currentProjectId!,
          user_id: state.user?.id!,
          action: 'RENAME_COLUMN',
          item_name: `${table?.name}.${column?.name} -> ${updates.name}`,
          details: {},
          created_at: new Date().toISOString()
        });
      } else if (updates.type && updates.type !== column?.type) {
        newLogs.unshift({
          id: `log_${Date.now()}`,
          project_id: state.currentProjectId!,
          user_id: state.user?.id!,
          action: 'ALTER_TYPE',
          item_name: `${table?.name}.${column?.name}`,
          details: { from: column?.type, to: updates.type },
          created_at: new Date().toISOString()
        });
      }

      return {
        currentSchema: {
          ...state.currentSchema,
          tables: state.currentSchema.tables.map((t) =>
            t.id === tableId ? {
              ...t,
              columns: t.columns.map(c => c.id === columnId ? { ...c, ...updates } : c)
            } : t
          )
        },
        sessionLogs: newLogs
      };
    });
    get().saveSchema();
    get().validateSchema();
  },

  removeColumn: (tableId, columnId) => {
    set((state) => {
      const table = state.currentSchema.tables.find(t => t.id === tableId);
      const column = table?.columns.find(c => c.id === columnId);
      return {
        currentSchema: {
          ...state.currentSchema,
          tables: state.currentSchema.tables.map((t) =>
            t.id === tableId ? { ...t, columns: t.columns.filter(c => c.id !== columnId) } : t
          )
        },
        sessionLogs: [{
          id: `log_${Date.now()}`,
          project_id: state.currentProjectId!,
          user_id: state.user?.id!,
          action: 'REMOVE_COLUMN',
          item_name: `${table?.name}.${column?.name}`,
          details: {},
          created_at: new Date().toISOString()
        }, ...state.sessionLogs]
      };
    });
    get().saveSchema();
    get().validateSchema();
  },

  toggleAIPanel: () => set((state) => ({ isAIPanelOpen: !state.isAIPanelOpen })),
  toggleMigrationPreview: () => set((state) => ({ isMigrationPreviewOpen: !state.isMigrationPreviewOpen })),
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),
  setConsoleOpen: (open) => set({ isConsoleOpen: open }),
  setDeploying: (deploying) => set({ isDeploying: deploying }),

  selectRelationship: (id) => set({ selectedRelationshipId: id }),

  updateRelationship: (id, updates) => {
    set((state) => ({
      currentSchema: {
        ...state.currentSchema,
        relationships: state.currentSchema.relationships.map((r) =>
          r.id === id ? { ...r, ...updates } : r
        )
      }
    }));
    get().saveSchema();
    get().validateSchema();
  },

  validateSchema: () => {
    const { currentSchema } = get();
    const issues: ValidationIssue[] = [];

    currentSchema.tables.forEach(table => {
      // Check for PK
      if (!table.columns.some(c => c.isPrimaryKey)) {
        issues.push({
          id: `pk-${table.id}`,
          type: 'error',
          message: `Table "${table.name}" is missing a Primary Key.`,
          targetId: table.id,
          targetType: 'table'
        });
      }

      // Check for missing RLS
      if ((!table.policies || table.policies.length === 0) && table.name !== 'users') {
        issues.push({
          id: `rls-${table.id}`,
          type: 'warning',
          message: `Table "${table.name}" has no RLS policies.`,
          targetId: table.id,
          targetType: 'table'
        });
      }

      // Check for missing indexes on FKs
      currentSchema.relationships.forEach(rel => {
        if (rel.fromTable === table.id) {
          issues.push({
            id: `idx-${rel.id}`,
            type: 'warning',
            message: `Column "${rel.fromColumn}" is used as FK but has no index.`,
            targetId: table.id,
            targetType: 'column'
          });
        }
      });

      // Check for semantic mismatches
      table.columns.forEach(col => {
        if (col.semanticType === 'email' && col.type !== 'varchar' && col.type !== 'text') {
          issues.push({
            id: `sem-${col.id}`,
            type: 'error',
            message: `Column "${col.name}" is marked as Email but type is ${col.type}.`,
            targetId: col.id,
            targetType: 'column'
          });
        }

        // Check for common naming mistakes
        if (col.name.endsWith('_id') && !currentSchema.relationships.some(r => (r.fromTable === table.id && r.fromColumn === col.name) || (r.toTable === table.id && r.toColumn === col.name))) {
          issues.push({
            id: `naming-${col.id}`,
            type: 'warning',
            message: `Column "${col.name}" ends in _id but is not part of a relationship.`,
            targetId: col.id,
            targetType: 'column'
          });
        }
      });
    });

    set({ validationIssues: issues });
  },

  setActiveRightPanel: (panel) => set({ activeRightPanel: panel }),
  setDialect: (dialect) => set({ codeDialect: dialect }),
  setCodeViewMode: (mode) => set({ codeViewMode: mode }),
  snapshotSchema: () => set((state) => ({ baseSchema: JSON.parse(JSON.stringify(state.currentSchema)) })),
}));

export const semanticToSql = (semantic: SemanticType): Partial<Column> => {
  switch (semantic) {
    case 'email': return { type: 'varchar', isUnique: true, isNullable: false };
    case 'username': return { type: 'varchar', isUnique: true, isNullable: false };
    case 'password_hash': return { type: 'text', isNullable: false };
    case 'currency': return { type: 'decimal', isNullable: false };
    case 'timestamp_created': return { type: 'timestamp', defaultValue: 'now()', isNullable: false };
    case 'timestamp_updated': return { type: 'timestamp', defaultValue: 'now()', isNullable: false };
    case 'soft_delete': return { type: 'timestamp', isNullable: true };
    case 'slug': return { type: 'varchar', isUnique: true, isNullable: false };
    case 'url': return { type: 'text', isNullable: true };
    default: return {};
  }
};

