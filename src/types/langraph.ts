// Lang Graph Agent Types

export interface CustomerPayload {
  customer_name: string;
  email: string;
  query: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  ticket_id: string;
  created_at: string;
  [key: string]: any;
}

export interface WorkflowState {
  payload: CustomerPayload;
  current_stage: string;
  stage_history: string[];
  execution_log: ExecutionLog[];
  abilities_executed: string[];
  state_variables: Record<string, any>;
  errors: string[];
  human_input_required?: boolean;
  escalated?: boolean;
}

export interface ExecutionLog {
  timestamp: string;
  stage: string;
  action: string;
  ability: string;
  server: 'ATLAS' | 'COMMON';
  status: 'success' | 'error' | 'pending';
  result?: any;
  error?: string;
}

export interface StageDefinition {
  id: string;
  name: string;
  emoji: string;
  description: string;
  mode: 'deterministic' | 'non-deterministic' | 'human';
  abilities: AbilityDefinition[];
  next_stages: string[];
  condition?: (state: WorkflowState) => boolean;
}

export interface AbilityDefinition {
  name: string;
  description: string;
  server: 'ATLAS' | 'COMMON';
  input_schema: Record<string, any>;
  output_schema: Record<string, any>;
  required: boolean;
}

export interface MCPClient {
  name: 'ATLAS' | 'COMMON';
  execute: (ability: string, params: any) => Promise<any>;
  available_abilities: string[];
}

export interface LangGraphAgent {
  id: string;
  name: string;
  description: string;
  stages: StageDefinition[];
  initial_stage: string;
  mcp_clients: MCPClient[];
  state: WorkflowState;
  execute_stage: (stage_id: string) => Promise<void>;
  transition_to_next: () => Promise<void>;
  get_current_stage: () => StageDefinition | null;
  reset: () => void;
}