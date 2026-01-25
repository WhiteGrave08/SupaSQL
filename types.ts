
export type DataType = 'uuid' | 'text' | 'varchar' | 'int' | 'bigint' | 'boolean' | 'timestamp' | 'jsonb' | 'decimal';

export type SemanticType =
  | 'none'
  | 'email'
  | 'username'
  | 'password_hash'
  | 'currency'
  | 'timestamp_created'
  | 'timestamp_updated'
  | 'soft_delete'
  | 'slug'
  | 'url';

export interface Column {
  id: string;
  name: string;
  type: DataType;
  semanticType?: SemanticType;
  isNullable: boolean;
  isPrimaryKey: boolean;
  defaultValue?: string;
  isUnique?: boolean;
  description?: string;
}

export interface Table {
  id: string;
  name: string;
  columns: Column[];
  position: { x: number; y: number };
  description?: string;
  policies?: string[];
}

export type RelationAction = 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';

export interface Relationship {
  id: string;
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  onDelete?: RelationAction;
  onUpdate?: RelationAction;
}

export interface ValidationIssue {
  id: string;
  type: 'error' | 'warning';
  message: string;
  targetId?: string; // tableId or colId
  targetType?: 'table' | 'column' | 'relationship';
}

export interface CanonicalSchema {
  tables: Table[];
  relationships: Relationship[];
  version: string;
}

export interface AISuggestion {
  id: string;
  type: 'index' | 'relation' | 'column' | 'optimization';
  title: string;
  description: string;
  rationale: string;
  impact: 'low' | 'medium' | 'high';
  action: () => void;
}

export interface MigrationStep {
  type: 'ADD_TABLE' | 'ADD_COLUMN' | 'ALTER_COLUMN' | 'DROP_TABLE' | 'ADD_INDEX';
  sql: string;
  isDestructive: boolean;
}

export interface Project {
  id: string;
  name: string;
  data: CanonicalSchema;
  updated_at: string;
  is_public: boolean;
  user_id: string;
}

export interface AuditLog {
  id: string;
  project_id: string;
  user_id: string;
  action: string;
  item_name: string;
  details: any;
  created_at: string;
}
