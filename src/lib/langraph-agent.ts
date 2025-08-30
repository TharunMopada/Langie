// Lang Graph Agent Implementation

import { v4 as uuidv4 } from 'uuid';
import type { 
  LangGraphAgent, 
  WorkflowState, 
  StageDefinition, 
  CustomerPayload,
  ExecutionLog,
  MCPClient 
} from '@/types/langraph';
import { atlasClient, commonClient } from './mcp-clients';

// 11-Stage Customer Support Workflow Definition
export const stageDefinitions: StageDefinition[] = [
  {
    id: 'intake',
    name: 'INTAKE',
    emoji: '📥',
    description: 'Accept incoming request payload',
    mode: 'deterministic',
    abilities: [{
      name: 'accept_payload',
      description: 'Capture incoming request payload',
      server: 'COMMON',
      input_schema: {},
      output_schema: {},
      required: true
    }],
    next_stages: ['understand']
  },
  {
    id: 'understand',
    name: 'UNDERSTAND',
    emoji: '🧠',
    description: 'Parse and extract entities from request',
    mode: 'deterministic',
    abilities: [
      {
        name: 'parse_request_text',
        description: 'Convert unstructured request to structured data',
        server: 'COMMON',
        input_schema: {},
        output_schema: {},
        required: true
      },
      {
        name: 'extract_entities',
        description: 'Identify product, account, dates',
        server: 'ATLAS',
        input_schema: {},
        output_schema: {},
        required: true
      }
    ],
    next_stages: ['prepare']
  },
  {
    id: 'prepare',
    name: 'PREPARE',
    emoji: '🛠️',
    description: 'Normalize and enrich data',
    mode: 'deterministic',
    abilities: [
      {
        name: 'normalize_fields',
        description: 'Standardize dates, codes, IDs',
        server: 'COMMON',
        input_schema: {},
        output_schema: {},
        required: true
      },
      {
        name: 'enrich_records',
        description: 'Add SLA, historical ticket info',
        server: 'ATLAS',
        input_schema: {},
        output_schema: {},
        required: true
      },
      {
        name: 'add_flags_calculations',
        description: 'Compute priority or SLA risk',
        server: 'COMMON',
        input_schema: {},
        output_schema: {},
        required: true
      }
    ],
    next_stages: ['ask', 'retrieve'] // May skip ASK if info is complete
  },
  {
    id: 'ask',
    name: 'ASK',
    emoji: '❓',
    description: 'Request missing information',
    mode: 'human',
    abilities: [{
      name: 'clarify_question',
      description: 'Request missing information',
      server: 'ATLAS',
      input_schema: {},
      output_schema: {},
      required: true
    }],
    next_stages: ['wait']
  },
  {
    id: 'wait',
    name: 'WAIT',
    emoji: '⏳',
    description: 'Wait for and process human response',
    mode: 'deterministic',
    abilities: [
      {
        name: 'extract_answer',
        description: 'Capture concise response',
        server: 'ATLAS',
        input_schema: {},
        output_schema: {},
        required: true
      }
    ],
    next_stages: ['retrieve']
  },
  {
    id: 'retrieve',
    name: 'RETRIEVE',
    emoji: '📚',
    description: 'Search knowledge base',
    mode: 'deterministic',
    abilities: [{
      name: 'knowledge_base_search',
      description: 'Lookup KB or FAQ',
      server: 'ATLAS',
      input_schema: {},
      output_schema: {},
      required: true
    }],
    next_stages: ['decide']
  },
  {
    id: 'decide',
    name: 'DECIDE',
    emoji: '⚖️',
    description: 'Evaluate solutions and decide on escalation',
    mode: 'non-deterministic',
    abilities: [
      {
        name: 'solution_evaluation',
        description: 'Score potential solutions 1-100',
        server: 'COMMON',
        input_schema: {},
        output_schema: {},
        required: true
      },
      {
        name: 'escalation_decision',
        description: 'Assign to human agent if score <90',
        server: 'ATLAS',
        input_schema: {},
        output_schema: {},
        required: true
      }
    ],
    next_stages: ['update', 'create']
  },
  {
    id: 'update',
    name: 'UPDATE',
    emoji: '🔄',
    description: 'Update ticket status',
    mode: 'deterministic',
    abilities: [
      {
        name: 'update_ticket',
        description: 'Modify status, fields, priority',
        server: 'ATLAS',
        input_schema: {},
        output_schema: {},
        required: true
      },
      {
        name: 'close_ticket',
        description: 'Mark issue resolved',
        server: 'ATLAS',
        input_schema: {},
        output_schema: {},
        required: false
      }
    ],
    next_stages: ['create']
  },
  {
    id: 'create',
    name: 'CREATE',
    emoji: '✍️',
    description: 'Generate customer response',
    mode: 'deterministic',
    abilities: [{
      name: 'response_generation',
      description: 'Draft customer reply',
      server: 'COMMON',
      input_schema: {},
      output_schema: {},
      required: true
    }],
    next_stages: ['do']
  },
  {
    id: 'do',
    name: 'DO',
    emoji: '🏃',
    description: 'Execute actions and notifications',
    mode: 'deterministic',
    abilities: [
      {
        name: 'execute_api_calls',
        description: 'Trigger CRM/order system actions',
        server: 'ATLAS',
        input_schema: {},
        output_schema: {},
        required: true
      },
      {
        name: 'trigger_notifications',
        description: 'Notify customer',
        server: 'ATLAS',
        input_schema: {},
        output_schema: {},
        required: true
      }
    ],
    next_stages: ['complete']
  },
  {
    id: 'complete',
    name: 'COMPLETE',
    emoji: '✅',
    description: 'Output final payload',
    mode: 'deterministic',
    abilities: [],
    next_stages: []
  }
];

export class CustomerSupportAgent implements LangGraphAgent {
  id: string;
  name: string;
  description: string;
  stages: StageDefinition[];
  initial_stage: string;
  mcp_clients: MCPClient[];
  state: WorkflowState;

  constructor(initialPayload?: Partial<CustomerPayload>) {
    this.id = uuidv4();
    this.name = 'Langie - Customer Support Agent';
    this.description = 'A structured and logical Lang Graph Agent for customer support workflows';
    this.stages = stageDefinitions;
    this.initial_stage = 'intake';
    this.mcp_clients = [atlasClient, commonClient];
    
    this.state = {
      payload: {
        customer_name: initialPayload?.customer_name || '',
        email: initialPayload?.email || '',
        query: initialPayload?.query || '',
        priority: initialPayload?.priority || 'medium',
        ticket_id: initialPayload?.ticket_id || `TKT-${Date.now()}`,
        created_at: new Date().toISOString(),
        ...initialPayload
      },
      current_stage: this.initial_stage,
      stage_history: [this.initial_stage],
      execution_log: [],
      abilities_executed: [],
      state_variables: {},
      errors: [],
      human_input_required: false,
      escalated: false
    };
  }

  private log(action: string, ability: string, server: 'ATLAS' | 'COMMON', status: 'success' | 'error' | 'pending', result?: any, error?: string) {
    const logEntry: ExecutionLog = {
      timestamp: new Date().toISOString(),
      stage: this.state.current_stage,
      action,
      ability,
      server,
      status,
      result,
      error
    };
    this.state.execution_log.push(logEntry);
  }

  async execute_stage(stage_id: string): Promise<void> {
    const stage = this.stages.find(s => s.id === stage_id);
    if (!stage) {
      throw new Error(`Stage ${stage_id} not found`);
    }

    this.state.current_stage = stage_id;
    if (!this.state.stage_history.includes(stage_id)) {
      this.state.stage_history.push(stage_id);
    }

    console.log(`🎭 Langie executing stage: ${stage.emoji} ${stage.name.toUpperCase()}`);

    try {
      // Special handling for INTAKE and COMPLETE stages
      if (stage_id === 'intake') {
        this.log('stage_execution', 'accept_payload', 'COMMON', 'success', 
          { message: 'Payload accepted successfully', payload: this.state.payload });
        return;
      }

      if (stage_id === 'complete') {
        this.log('stage_execution', 'output_payload', 'COMMON', 'success', 
          { message: 'Workflow completed', final_payload: this.state.payload });
        return;
      }

      // Execute abilities based on stage mode
      if (stage.mode === 'deterministic') {
        await this.executeDeterministicStage(stage);
      } else if (stage.mode === 'non-deterministic') {
        await this.executeNonDeterministicStage(stage);
      } else if (stage.mode === 'human') {
        await this.executeHumanStage(stage);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.state.errors.push(`Error in stage ${stage_id}: ${errorMessage}`);
      this.log('stage_execution', 'error', 'COMMON', 'error', null, errorMessage);
      console.error(`❌ Error in stage ${stage_id}:`, errorMessage);
    }
  }

  private async executeDeterministicStage(stage: StageDefinition): Promise<void> {
    console.log(`🔄 Executing deterministic stage: ${stage.name}`);
    
    for (const ability of stage.abilities) {
      await this.executeAbility(ability.name, ability.server, this.state.payload);
    }
  }

  private async executeNonDeterministicStage(stage: StageDefinition): Promise<void> {
    console.log(`🎲 Executing non-deterministic stage: ${stage.name}`);
    
    if (stage.id === 'decide') {
      // First evaluate solutions
      const evaluationResult = await this.executeAbility('solution_evaluation', 'COMMON', this.state.payload);
      const score = evaluationResult?.best_solution?.score || 0;
      
      // Then make escalation decision based on score
      const escalationResult = await this.executeAbility('escalation_decision', 'ATLAS', { 
        ...this.state.payload, 
        score 
      });
      
      if (escalationResult?.escalate) {
        this.state.escalated = true;
        this.state.state_variables.escalation_reason = escalationResult.reason;
        // Log the decision reasoning
        this.log('decision_reasoning', 'escalation_logic', 'ATLAS', 'success', {
          reason: `Solution score = ${score} < 90 → escalated`,
          decision: 'escalate'
        });
      } else {
        this.log('decision_reasoning', 'escalation_logic', 'ATLAS', 'success', {
          reason: `Solution score = ${score} >= 90 → auto-resolve`,
          decision: 'resolve'
        });
      }
    }
  }

  private async executeHumanStage(stage: StageDefinition): Promise<void> {
    console.log(`👤 Executing human interaction stage: ${stage.name}`);
    this.state.human_input_required = true;
    
    for (const ability of stage.abilities) {
      await this.executeAbility(ability.name, ability.server, this.state.payload);
    }
  }

  private async executeAbility(abilityName: string, server: 'ATLAS' | 'COMMON', params: any): Promise<any> {
    const client = this.mcp_clients.find(c => c.name === server);
    if (!client) {
      throw new Error(`MCP Client ${server} not found`);
    }

    this.log('ability_execution', abilityName, server, 'pending');
    console.log(`  🔧 Executing ability: ${abilityName} via ${server}`);

    try {
      const result = await client.execute(abilityName, params);
      this.log('ability_execution', abilityName, server, 'success', result);
      this.state.abilities_executed.push(abilityName);
      
      // Update state variables with results
      this.state.state_variables[abilityName] = result;
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log('ability_execution', abilityName, server, 'error', null, errorMessage);
      throw error;
    }
  }

  async transition_to_next(): Promise<void> {
    const currentStage = this.get_current_stage();
    if (!currentStage || currentStage.next_stages.length === 0) {
      console.log('🏁 Workflow completed or no next stages available');
      return;
    }

    // Determine next stage based on workflow logic
    let nextStageId = currentStage.next_stages[0]; // Default to first option

    // Custom transition logic
    if (currentStage.id === 'prepare') {
      // Skip ASK if we have enough information
      const hasRequiredInfo = this.state.payload.customer_name && this.state.payload.email;
      nextStageId = hasRequiredInfo ? 'retrieve' : 'ask';
    } else if (currentStage.id === 'decide') {
      // Go to UPDATE if escalated, otherwise CREATE
      nextStageId = this.state.escalated ? 'update' : 'create';
    }

    console.log(`🔄 Transitioning from ${currentStage.name} to ${nextStageId.toUpperCase()}`);
    await this.execute_stage(nextStageId);
  }

  get_current_stage(): StageDefinition | null {
    return this.stages.find(s => s.id === this.state.current_stage) || null;
  }

  reset(): void {
    this.state = {
      payload: {
        customer_name: '',
        email: '',
        query: '',
        priority: 'medium',
        ticket_id: `TKT-${Date.now()}`,
        created_at: new Date().toISOString()
      },
      current_stage: this.initial_stage,
      stage_history: [this.initial_stage],
      execution_log: [],
      abilities_executed: [],
      state_variables: {},
      errors: [],
      human_input_required: false,
      escalated: false
    };
  }

  // Helper method to run the complete workflow
  async runCompleteWorkflow(): Promise<WorkflowState> {
    console.log('🚀 Starting complete workflow execution...');
    
    while (this.state.current_stage !== 'complete') {
      await this.execute_stage(this.state.current_stage);
      
      // Handle human input requirement
      if (this.state.human_input_required && this.state.current_stage === 'ask') {
        // Simulate human response for demo
        this.state.human_input_required = false;
        await this.transition_to_next(); // Move to WAIT
        continue;
      }
      
      await this.transition_to_next();
      
      // Prevent infinite loops
      if (this.state.stage_history.length > 20) {
        console.warn('⚠️ Maximum stage execution limit reached');
        break;
      }
    }
    
    console.log('✅ Workflow execution completed!');
    return this.state;
  }
}