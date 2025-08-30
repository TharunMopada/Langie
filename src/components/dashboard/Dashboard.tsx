import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Bot, Workflow, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

import WorkflowVisualization from '@/components/workflow/WorkflowVisualization';
import StatePanel from './StatePanel';
import ControlPanel from './ControlPanel';
import { CustomerSupportAgent } from '@/lib/langraph-agent';
import type { CustomerPayload, WorkflowState } from '@/types/langraph';

const Dashboard = () => {
  const [agent, setAgent] = useState<CustomerSupportAgent | null>(null);
  const [workflowState, setWorkflowState] = useState<WorkflowState | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleStartWorkflow = useCallback(async (payload: CustomerPayload) => {
    try {
      setIsRunning(true);
      const newAgent = new CustomerSupportAgent(payload);
      setAgent(newAgent);
      setWorkflowState(newAgent.state);
      
      toast({
        title: "Workflow Started",
        description: `Processing ticket ${payload.ticket_id} for ${payload.customer_name}`,
      });

      // Run the complete workflow
      const finalState = await newAgent.runCompleteWorkflow();
      setWorkflowState(finalState);
      
      toast({
        title: "Workflow Completed",
        description: `Ticket ${payload.ticket_id} processed successfully through all stages`,
      });
    } catch (error) {
      console.error('Workflow execution error:', error);
      toast({
        title: "Workflow Error",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  }, []);

  const handleStepExecution = useCallback(async () => {
    if (!agent || !workflowState) return;

    try {
      setIsRunning(true);
      await agent.transition_to_next();
      setWorkflowState({ ...agent.state });
      
      toast({
        title: "Stage Executed",
        description: `Moved to stage: ${agent.state.current_stage.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Step execution error:', error);
      toast({
        title: "Step Error",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  }, [agent, workflowState]);

  const handleReset = useCallback(() => {
    setAgent(null);
    setWorkflowState(null);
    setIsRunning(false);
    
    toast({
      title: "Workflow Reset",
      description: "All state cleared. Ready for new workflow execution.",
    });
  }, []);

  const handleNodeClick = useCallback((stageId: string) => {
    if (!agent || isRunning) return;
    
    toast({
      title: "Stage Info",
      description: `Clicked on stage: ${stageId.toUpperCase()}`,
    });
  }, [agent, isRunning]);

  const getWorkflowStats = () => {
    if (!workflowState) return null;
    
    const totalStages = 11;
    const completedStages = workflowState.stage_history.length;
    const successfulExecutions = workflowState.execution_log.filter(log => log.status === 'success').length;
    const errors = workflowState.errors.length;
    
    return { totalStages, completedStages, successfulExecutions, errors };
  };

  const stats = getWorkflowStats();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/20">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-ai bg-clip-text text-transparent">
                Langie - Lang Graph Agent
              </h1>
              <p className="text-muted-foreground">
                Customer Support Workflow Orchestrator
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          {stats && (
            <div className="grid grid-cols-4 gap-4">
              <Card className="ai-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-primary" />
                    <div>
                      <div className="text-sm font-medium">Progress</div>
                      <div className="text-2xl font-bold text-primary">
                        {stats.completedStages}/{stats.totalStages}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="ai-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-success" />
                    <div>
                      <div className="text-sm font-medium">Successful</div>
                      <div className="text-2xl font-bold text-success">
                        {stats.successfulExecutions}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="ai-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <div>
                      <div className="text-sm font-medium">Errors</div>
                      <div className="text-2xl font-bold text-destructive">
                        {stats.errors}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="ai-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-warning" />
                    <div>
                      <div className="text-sm font-medium">Status</div>
                      <Badge variant="outline" className={
                        isRunning ? 'bg-warning/20 text-warning' :
                        workflowState?.current_stage === 'complete' ? 'bg-success/20 text-success' :
                        'bg-muted/20 text-muted-foreground'
                      }>
                        {isRunning ? 'Running' : 
                         workflowState?.current_stage === 'complete' ? 'Complete' : 
                         workflowState ? 'Paused' : 'Ready'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <ControlPanel
              onStartWorkflow={handleStartWorkflow}
              onStepExecution={handleStepExecution}
              onReset={handleReset}
              isRunning={isRunning}
              canStep={!!workflowState && workflowState.current_stage !== 'complete'}
            />
          </div>

          {/* Main Visualization */}
          <div className="lg:col-span-2">
            <Card className="ai-card h-[700px]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
                  <Workflow className="w-4 h-4" />
                  Workflow Visualization
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-4rem)]">
                {workflowState ? (
                  <WorkflowVisualization 
                    workflowState={workflowState} 
                    onNodeClick={handleNodeClick}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-muted-foreground">
                      <Workflow className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Ready to Start</p>
                      <p className="text-sm">
                        Configure customer input and click "Start" to begin workflow execution
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* State Panel */}
          <div className="lg:col-span-1">
            {workflowState ? (
              <StatePanel workflowState={workflowState} />
            ) : (
              <Card className="ai-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-primary">Workflow State</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground py-8">
                    <p className="text-sm">
                      No active workflow. Start a workflow to see state information.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Configuration Info */}
        <div className="mt-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="stages">Stages</TabsTrigger>
              <TabsTrigger value="mcp">MCP Servers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <Card className="ai-card">
                <CardHeader>
                  <CardTitle className="text-lg">Lang Graph Agent Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Agent Capabilities</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Graph Orchestration with 11-stage workflow</li>
                      <li>• Deterministic and Non-deterministic execution modes</li>
                      <li>• State persistence across all stages</li>
                      <li>• MCP client integration (Atlas & Common servers)</li>
                      <li>• Human interaction handling</li>
                      <li>• Error handling and escalation management</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Workflow Features</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Real-time workflow visualization</li>
                      <li>• Stage-by-stage execution tracking</li>
                      <li>• Comprehensive logging and state management</li>
                      <li>• Interactive workflow control</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stages" className="mt-4">
              <Card className="ai-card">
                <CardHeader>
                  <CardTitle className="text-lg">11-Stage Workflow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {[
                      { id: 'intake', name: 'INTAKE', emoji: '📥', mode: 'deterministic', desc: 'Accept incoming request payload' },
                      { id: 'understand', name: 'UNDERSTAND', emoji: '🧠', mode: 'deterministic', desc: 'Parse and extract entities' },
                      { id: 'prepare', name: 'PREPARE', emoji: '🛠️', mode: 'deterministic', desc: 'Normalize and enrich data' },
                      { id: 'ask', name: 'ASK', emoji: '❓', mode: 'human', desc: 'Request missing information' },
                      { id: 'wait', name: 'WAIT', emoji: '⏳', mode: 'deterministic', desc: 'Process human response' },
                      { id: 'retrieve', name: 'RETRIEVE', emoji: '📚', mode: 'deterministic', desc: 'Search knowledge base' },
                      { id: 'decide', name: 'DECIDE', emoji: '⚖️', mode: 'non-deterministic', desc: 'Evaluate solutions and escalation' },
                      { id: 'update', name: 'UPDATE', emoji: '🔄', mode: 'deterministic', desc: 'Update ticket status' },
                      { id: 'create', name: 'CREATE', emoji: '✍️', mode: 'deterministic', desc: 'Generate customer response' },
                      { id: 'do', name: 'DO', emoji: '🏃', mode: 'deterministic', desc: 'Execute actions and notifications' },
                      { id: 'complete', name: 'COMPLETE', emoji: '✅', mode: 'deterministic', desc: 'Output final payload' }
                    ].map((stage) => (
                      <div key={stage.id} className="flex items-center gap-3 p-2 rounded border border-border">
                        <span className="text-lg">{stage.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{stage.name}</span>
                            <Badge variant="outline" className={
                              stage.mode === 'deterministic' ? 'bg-info/20 text-info' :
                              stage.mode === 'non-deterministic' ? 'bg-warning/20 text-warning' :
                              'bg-accent/20 text-accent-foreground'
                            }>
                              {stage.mode}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{stage.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mcp" className="mt-4">
              <Card className="ai-card">
                <CardHeader>
                  <CardTitle className="text-lg">MCP Server Integration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 text-primary">ATLAS Server (External Systems)</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Handles abilities requiring external system interaction
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {['extract_entities', 'enrich_records', 'clarify_question', 'extract_answer', 'knowledge_base_search', 
                        'escalation_decision', 'update_ticket', 'close_ticket', 'execute_api_calls', 'trigger_notifications'].map(ability => (
                        <div key={ability} className="p-2 bg-primary/10 rounded border">
                          {ability}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-accent">COMMON Server (Internal Processing)</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Handles abilities with no external dependencies
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {['parse_request_text', 'normalize_fields', 'add_flags_calculations', 'solution_evaluation', 'response_generation'].map(ability => (
                        <div key={ability} className="p-2 bg-accent/10 rounded border">
                          {ability}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;