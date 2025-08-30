# Langie - Lang Graph Customer Support Agent

## 🚀 Overview

**Langie** is a sophisticated Lang Graph Agent designed for customer support workflow orchestration. It models customer support processes as graph-based stages, with each stage representing a critical step in the workflow. The agent supports both deterministic and non-deterministic execution, state persistence, and seamless integration with MCP (Model Context Protocol) clients.

## 🧩 Agent Capabilities

### Graph Orchestration Agent (Lang Graph)
- ✅ **Workflow as Nodes**: Represent workflow as nodes (stages) with state persistence
- ✅ **Sequential Execution**: Execute deterministic nodes in sequence  
- ✅ **Dynamic Orchestration**: Orchestrate non-deterministic nodes by choosing abilities at runtime
- ✅ **MCP Integration**: Route abilities via MCP clients to Atlas or Common servers
- ✅ **State Management**: Comprehensive state persistence across all stages

### Customer Support Agent Flow
Implementation of **11 comprehensive stages**:

1. **📥 INTAKE** - Accept customer payload
2. **🧠 UNDERSTAND** - Parse request and extract entities  
3. **🛠️ PREPARE** - Normalize fields and enrich records
4. **❓ ASK** - Clarify missing information (Human interaction)
5. **⏳ WAIT** - Extract and store human responses
6. **📚 RETRIEVE** - Search knowledge base and store data
7. **⚖️ DECIDE** - Evaluate solutions and escalation (Non-deterministic)
8. **🔄 UPDATE** - Update ticket status and close if resolved
9. **✍️ CREATE** - Generate personalized customer response
10. **🏃 DO** - Execute API calls and trigger notifications
11. **✅ COMPLETE** - Output final structured payload

## 🏗️ Architecture

### Stage Execution Modes

#### Deterministic Stages
Execute abilities sequentially in predefined order:
- INTAKE, UNDERSTAND, PREPARE, WAIT, RETRIEVE, UPDATE, CREATE, DO, COMPLETE

#### Non-Deterministic Stages  
Choose abilities dynamically based on runtime context:
- **DECIDE**: Score solutions and escalate if confidence < 90%

#### Human Interaction Stages
Require human input before proceeding:
- **ASK**: Generate clarifying questions for missing information

### MCP Server Integration

#### 🌐 ATLAS Server (External Systems)
Handles abilities requiring external system interaction:
- `extract_entities` - Identify product, account, dates
- `enrich_records` - Add SLA, historical ticket info
- `clarify_question` - Request missing information
- `extract_answer` - Capture human responses
- `knowledge_base_search` - Lookup KB or FAQ
- `escalation_decision` - Assign to human agent if needed
- `update_ticket` - Modify status, fields, priority
- `close_ticket` - Mark issue resolved
- `execute_api_calls` - Trigger CRM/order system actions
- `trigger_notifications` - Notify customer

#### 🔧 COMMON Server (Internal Processing)
Handles abilities with no external dependencies:
- `parse_request_text` - Convert unstructured to structured data
- `normalize_fields` - Standardize dates, codes, IDs
- `add_flags_calculations` - Compute priority or SLA risk
- `solution_evaluation` - Score potential solutions 1-100
- `response_generation` - Draft customer reply

## 🎯 Key Features

### Real-Time Workflow Visualization
- Interactive React Flow diagram showing all 11 stages
- Live stage progression with active state highlighting
- Visual representation of deterministic vs non-deterministic flows
- MCP server routing visualization

### Comprehensive State Management
- Persistent state variables across all stages
- Execution logging with timestamps and status tracking
- Error handling and escalation management
- Human input requirement detection

### Professional Dashboard Interface
- **Control Panel**: Configure customer input and execution controls
- **Workflow Visualization**: Interactive stage-based flow diagram  
- **State Panel**: Real-time state variables and execution logs
- **Configuration Tabs**: Overview, stages, and MCP server details

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser
- React 18+ environment

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd langraph-support-orchestrator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Running a Demo Workflow

1. **Access the Dashboard**: Open your browser to `http://localhost:8080`

2. **Configure Customer Input**: Use the control panel to set:
   - Customer name and email
   - Support query description
   - Priority level (low/medium/high/urgent)

3. **Choose Execution Mode**:
   - **Start**: Run complete workflow automatically
   - **Step**: Execute one stage at a time for debugging
   - **Reset**: Clear all state and start over

4. **Monitor Execution**: Watch real-time progress through:
   - Interactive workflow visualization
   - State persistence panel
   - Execution log tracking

### Sample Scenarios

#### 💳 Billing Issue
```json
{
  "customer_name": "Sarah Johnson",
  "email": "sarah.johnson@email.com", 
  "query": "I was charged twice for my subscription this month. Can you help me get a refund for the duplicate charge?",
  "priority": "medium"
}
```

#### 🔧 Technical Problem  
```json
{
  "customer_name": "Mike Chen",
  "email": "mike.chen@techcompany.com",
  "query": "Our API integration stopped working after the latest update. We're getting 500 errors on all requests.",
  "priority": "high"
}
```

#### 🚨 Urgent Escalation
```json
{
  "customer_name": "Emma Wilson", 
  "email": "emma.wilson@startup.io",
  "query": "Our production system is down and we can't access our data. This is critical for our business!",
  "priority": "urgent"
}
```

## 📊 Workflow Execution Example

### Input Payload
```json
{
  "customer_name": "John Smith",
  "email": "john.smith@email.com",
  "query": "Having trouble with billing charges",
  "priority": "medium",
  "ticket_id": "TKT-1703875200000"
}
```

### Stage Execution Log
```
🎭 Langie executing stage: 📥 INTAKE
  🔧 Executing ability: accept_payload via COMMON

🎭 Langie executing stage: 🧠 UNDERSTAND  
  🔧 Executing ability: parse_request_text via COMMON
  🔧 Executing ability: extract_entities via ATLAS

🎭 Langie executing stage: 🛠️ PREPARE
  🔧 Executing ability: normalize_fields via COMMON
  🔧 Executing ability: enrich_records via ATLAS
  🔧 Executing ability: add_flags_calculations via COMMON

🎭 Langie executing stage: 📚 RETRIEVE
  🔧 Executing ability: knowledge_base_search via ATLAS

🎲 Langie executing stage: ⚖️ DECIDE
  🔧 Executing ability: solution_evaluation via COMMON
  🔧 Executing ability: escalation_decision via ATLAS

🎭 Langie executing stage: ✍️ CREATE
  🔧 Executing ability: response_generation via COMMON

🎭 Langie executing stage: 🏃 DO
  🔧 Executing ability: execute_api_calls via ATLAS
  🔧 Executing ability: trigger_notifications via ATLAS

✅ Workflow execution completed!
```

### Final Output Payload
```json
{
  "customer_name": "John Smith",
  "email": "john.smith@email.com",
  "query": "Having trouble with billing charges", 
  "priority": "medium",
  "ticket_id": "TKT-1703875200000",
  "resolution": "Automated billing adjustment processed",
  "response_time": "2.5 hours",
  "escalated": false,
  "satisfaction_survey_sent": true
}
```

## 🔧 Technical Implementation

### Core Technologies
- **React 18** with TypeScript for frontend
- **React Flow** for interactive workflow visualization
- **Tailwind CSS** with custom design system
- **Vite** for development and building
- **shadcn/ui** for component library

### Agent Implementation
- **`CustomerSupportAgent`**: Main Lang Graph agent class
- **`StageDefinition`**: Type-safe stage configuration
- **`MCPClient`**: Mock MCP server implementations
- **`WorkflowState`**: Comprehensive state management

### State Persistence
- Execution history tracking
- Stage transition logging  
- Error capture and handling
- State variable persistence
- Human input requirement detection

## 📋 Configuration Files

### Agent Config (`langraph-agent-config.json`)
Complete configuration including:
- Agent personality and behavior
- 11-stage workflow definitions
- MCP server ability mappings
- Input/output schemas
- Example prompts for each stage

### Stage Definitions
Each stage includes:
- Unique identifier and display name
- Execution mode (deterministic/non-deterministic/human)
- Required abilities and MCP server routing
- Next stage transitions
- Example execution prompts

## 🎯 Success Criteria

✅ **1. Correct Stage Modeling**: All 11 stages properly defined and connected  
✅ **2. Proper State Persistence**: State maintained across all stage transitions  
✅ **3. MCP Integration**: Abilities correctly routed to Atlas/Common servers  
✅ **4. Non-Deterministic Orchestration**: DECIDE stage implements dynamic ability selection  
✅ **5. Human Interaction Handling**: ASK/WAIT stages support human input requirements  
✅ **6. Error Handling**: Comprehensive error capture and escalation management  
✅ **7. Visual Workflow**: Interactive React Flow diagram with real-time updates  
✅ **8. Professional Interface**: Complete dashboard with control, visualization, and state panels

## 🚀 Future Enhancements

- **Real MCP Server Integration**: Connect to actual Atlas and Common MCP servers
- **Advanced Analytics**: Workflow performance metrics and optimization insights  
- **Multi-Language Support**: Internationalization for global customer support
- **AI Model Integration**: Connect to LLMs for enhanced natural language processing
- **Workflow Templates**: Pre-configured workflows for different support scenarios

---

**Langie** demonstrates the power of Lang Graph for orchestrating complex, multi-stage workflows with state persistence, dynamic decision-making, and seamless integration capabilities. The professional interface provides full visibility into the agent's decision-making process, making it an ideal foundation for production customer support automation.