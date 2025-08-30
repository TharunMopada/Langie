// Mock MCP Clients for demonstration

import type { MCPClient } from '@/types/langraph';

// Simulated delays for realistic demonstration
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ATLAS Server - External systems (CRM, KB, etc.)
export const atlasClient: MCPClient = {
  name: 'ATLAS',
  available_abilities: [
    'extract_entities',
    'enrich_records',
    'clarify_question',
    'extract_answer',
    'knowledge_base_search',
    'escalation_decision',
    'update_ticket',
    'close_ticket',
    'execute_api_calls',
    'trigger_notifications'
  ],
  execute: async (ability: string, params: any) => {
    await delay(Math.random() * 1000 + 500); // Simulate network delay
    
    switch (ability) {
      case 'extract_entities':
        return {
          entities: {
            product: 'Cloud Service',
            account_id: 'ACC-12345',
            issue_type: 'billing',
            urgency: 'high'
          }
        };
      
      case 'enrich_records':
        return {
          sla_info: { response_time: '4 hours', escalation_threshold: 72 },
          customer_tier: 'premium',
          historical_tickets: 3
        };
      
      case 'clarify_question':
        return {
          question: 'Could you please provide your account number for verification?',
          required_fields: ['account_number']
        };
      
      case 'extract_answer':
        return {
          answer: 'Account number: ACC-12345',
          verified: true
        };
      
      case 'knowledge_base_search':
        return {
          results: [
            {
              title: 'Billing Issues Resolution Guide',
              relevance: 0.95,
              content: 'For billing discrepancies, check account settings...'
            }
          ]
        };
      
      case 'escalation_decision':
        return {
          escalate: params.score < 90,
          assigned_agent: params.score < 90 ? 'senior-agent-123' : null,
          reason: params.score < 90 
            ? `Solution score = ${params.score} < 90 → escalated to human agent` 
            : `Solution score = ${params.score} >= 90 → auto-resolve`
        };
      
      case 'update_ticket':
        return {
          updated: true,
          new_status: 'in_progress',
          assigned_to: 'ai-agent'
        };
      
      case 'close_ticket':
        return {
          closed: true,
          resolution_time: '2.5 hours',
          satisfaction_survey_sent: true
        };
      
      case 'execute_api_calls':
        return {
          api_calls: [
            { endpoint: '/billing/refund', status: 'success' },
            { endpoint: '/account/update', status: 'success' }
          ]
        };
      
      case 'trigger_notifications':
        return {
          notifications_sent: [
            { type: 'email', recipient: params.email, status: 'sent' },
            { type: 'sms', recipient: params.phone, status: 'sent' }
          ]
        };
      
      default:
        throw new Error(`Unknown ATLAS ability: ${ability}`);
    }
  }
};

// COMMON Server - Internal processing (no external dependencies)
export const commonClient: MCPClient = {
  name: 'COMMON',
  available_abilities: [
    'parse_request_text',
    'normalize_fields',
    'add_flags_calculations',
    'solution_evaluation',
    'response_generation'
  ],
  execute: async (ability: string, params: any) => {
    await delay(Math.random() * 500 + 200); // Faster internal processing
    
    switch (ability) {
      case 'parse_request_text':
        return {
          structured_data: {
            intent: 'billing_inquiry',
            sentiment: 'frustrated',
            category: 'technical_support',
            keywords: ['billing', 'charge', 'unexpected']
          }
        };
      
      case 'normalize_fields':
        return {
          normalized: {
            customer_name: params.customer_name?.toLowerCase()?.trim(),
            email: params.email?.toLowerCase()?.trim(),
            priority: params.priority || 'medium',
            created_at: new Date().toISOString()
          }
        };
      
      case 'add_flags_calculations':
        return {
          flags: {
            high_priority: params.priority === 'urgent',
            premium_customer: true,
            sla_risk: false,
            escalation_score: 75
          }
        };
      
      case 'solution_evaluation':
        const score = Math.floor(Math.random() * 40) + 60; // 60-100 range
        return {
          solutions: [
            {
              id: 'sol-1',
              description: 'Automated billing adjustment',
              confidence_score: score,
              estimated_resolution_time: '15 minutes'
            }
          ],
          best_solution: {
            id: 'sol-1',
            score: score
          },
          reason: `Evaluated solution scored ${score}/100 based on complexity and available data`
        };
      
      case 'response_generation':
        return {
          response: `Dear ${params.customer_name}, thank you for contacting us regarding your billing inquiry. We've reviewed your account and found the issue. We'll process a refund within 3-5 business days.`,
          tone: 'professional',
          personalized: true
        };
      
      default:
        throw new Error(`Unknown COMMON ability: ${ability}`);
    }
  }
};

export const mcpClients = [atlasClient, commonClient];