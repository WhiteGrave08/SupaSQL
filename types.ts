
export type DataType = 'uuid' | 'text' | 'varchar' | 'int' | 'bigint' | 'boolean' | 'timestamp' | 'jsonb' | 'decimal';

export interface Column {
  id: string;
  name: string;
  type: DataType;
  isNullable: boolean;
  isPrimaryKey: boolean;
  defaultValue?: string;
  isUnique?: boolean;
}

export interface Table {
  id: string;
  name: string;
  columns: Column[];
  position: { x: number; y: number };
  description?: string;
}

export interface Relationship {
  id: string;
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
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
