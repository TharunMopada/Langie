import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { WorkflowState } from '@/types/langraph';

interface StatePanelProps {
  workflowState: WorkflowState;
}

const StatePanel = ({ workflowState }: StatePanelProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-success/20 text-success';
      case 'error': return 'bg-destructive/20 text-destructive';
      case 'pending': return 'bg-warning/20 text-warning';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      {/* Current State */}
      <Card className="ai-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-primary">Current State</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Stage:</span>
            <Badge variant="outline" className="bg-primary/20 text-primary">
              {workflowState.current_stage.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Ticket ID:</span>
            <span className="text-sm font-mono">{workflowState.payload.ticket_id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Priority:</span>
            <Badge variant="outline" className={
              workflowState.payload.priority === 'urgent' ? 'bg-destructive/20 text-destructive' :
              workflowState.payload.priority === 'high' ? 'bg-warning/20 text-warning' :
              'bg-success/20 text-success'
            }>
              {workflowState.payload.priority}
            </Badge>
          </div>
          {workflowState.escalated && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Escalated:</span>
              <Badge variant="outline" className="bg-warning/20 text-warning">
                Yes
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payload Data */}
      <Card className="ai-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-primary">Customer Payload</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-32">
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <span className="ml-2 font-medium">{workflowState.payload.customer_name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <span className="ml-2 font-medium">{workflowState.payload.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Query:</span>
                <p className="mt-1 text-foreground">{workflowState.payload.query}</p>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Execution Log */}
      <Card className="ai-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-primary">
            Execution Log ({workflowState.execution_log.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            <div className="space-y-2">
              {workflowState.execution_log.slice(-10).reverse().map((log, index) => (
                <div key={index} className="text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getStatusColor(log.status)}>
                {log.status}
              </Badge>
              <span className="font-medium">{log.ability}</span>
              <Badge variant="outline" className={
                log.server === 'ATLAS' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                'bg-green-100 text-green-700 border-green-200'
              }>
                {log.server === 'ATLAS' ? '🔵 ATLAS' : '🟢 COMMON'}
              </Badge>
            </div>
          </div>
          <div className="text-muted-foreground mt-1">
            {log.stage.toUpperCase()} • {new Date(log.timestamp).toLocaleTimeString()}
            {log.result?.reason && (
              <div className="text-xs text-primary mt-1 font-medium">
                → {log.result.reason}
              </div>
            )}
          </div>
                  {log.error && (
                    <div className="text-destructive mt-1">{log.error}</div>
                  )}
                  <Separator className="mt-2" />
                </div>
              ))}
              {workflowState.execution_log.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  No execution logs yet
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* State Evolution */}
      <Card className="ai-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-primary">State Evolution</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-32">
            <div className="space-y-2 text-xs">
              {workflowState.stage_history.map((stage, index) => {
                const stageChanges = Object.entries(workflowState.state_variables)
                  .filter(([key]) => key.includes(stage) || stage === 'prepare')
                  .slice(0, 2);
                
                return (
                  <div key={`${stage}-${index}`} className="p-2 border border-border rounded">
                    <div className="font-medium text-primary">{stage.toUpperCase()}</div>
                    {stageChanges.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {stageChanges.map(([key, value]) => (
                          <div key={key} className="text-muted-foreground">
                            <span className="font-mono">{key}:</span>
                            <span className="ml-1">
                              {typeof value === 'object' && value?.score 
                                ? `Score: ${value.score}` 
                                : typeof value === 'object' && value?.status 
                                ? value.status 
                                : String(value).substring(0, 20) + (String(value).length > 20 ? '...' : '')
                              }
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {workflowState.stage_history.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  No stages executed yet
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Final Output Payload */}
      {workflowState.current_stage === 'complete' && (
        <Card className="ai-card border-success/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-success">Final Output Payload</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <pre className="text-xs text-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded">
                {JSON.stringify({
                  ticket_id: workflowState.payload.ticket_id,
                  status: workflowState.escalated ? 'Escalated' : 'Resolved',
                  escalated: workflowState.escalated,
                  priority: workflowState.payload.priority,
                  customer_name: workflowState.payload.customer_name,
                  email: workflowState.payload.email,
                  query: workflowState.payload.query,
                  final_response: workflowState.state_variables.response_generation?.response || 'Processing complete',
                  execution_time: new Date(workflowState.payload.created_at).toISOString(),
                  stages_executed: workflowState.stage_history.length,
                  abilities_count: workflowState.abilities_executed.length
                }, null, 2)}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* State Variables */}
      <Card className="ai-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-primary">State Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-32">
            <div className="space-y-2 text-xs">
              {Object.entries(workflowState.state_variables).map(([key, value]) => (
                <div key={key}>
                  <span className="text-muted-foreground">{key}:</span>
                  <pre className="mt-1 text-foreground whitespace-pre-wrap">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                  <Separator className="mt-2" />
                </div>
              ))}
              {Object.keys(workflowState.state_variables).length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  No state variables yet
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatePanel;