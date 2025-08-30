import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Play, RotateCcw, Pause, StepForward, Loader2 } from 'lucide-react';
import type { CustomerPayload } from '@/types/langraph';

interface ControlPanelProps {
  onStartWorkflow: (payload: CustomerPayload) => void;
  onStepExecution: () => void;
  onReset: () => void;
  isRunning: boolean;
  canStep: boolean;
}

const ControlPanel = ({ 
  onStartWorkflow, 
  onStepExecution, 
  onReset, 
  isRunning, 
  canStep 
}: ControlPanelProps) => {
  const [formData, setFormData] = useState<{
    customer_name: string;
    email: string;
    query: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }>({
    customer_name: 'John Smith',
    email: 'john.smith@email.com',
    query: 'I was charged twice for my subscription this month. Can you help me get a refund for the duplicate charge?',
    priority: 'medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CustomerPayload = {
      ...formData,
      ticket_id: `TKT-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    onStartWorkflow(payload);
  };

  const loadSampleData = (sample: 'billing' | 'technical' | 'urgent') => {
    const samples = {
      billing: {
        customer_name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        query: 'I was charged twice for my subscription this month. Can you help me get a refund for the duplicate charge?',
        priority: 'medium' as const
      },
      technical: {
        customer_name: 'Mike Chen',
        email: 'mike.chen@techcompany.com',
        query: 'Our API integration stopped working after the latest update. We\'re getting 500 errors on all requests.',
        priority: 'high' as const
      },
      urgent: {
        customer_name: 'Emma Wilson',
        email: 'emma.wilson@startup.io',
        query: 'Our production system is down and we can\'t access our data. This is critical for our business!',
        priority: 'urgent' as const
      }
    };
    setFormData(samples[sample]);
  };

  return (
    <div className="space-y-4">
      {/* Control Buttons */}
      <Card className="ai-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-primary">Workflow Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Button 
              onClick={handleSubmit} 
              disabled={isRunning}
              className="flex-1"
              variant="default"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </>
              )}
            </Button>
            <Button 
              onClick={onStepExecution} 
              disabled={!canStep || isRunning}
              variant="outline"
            >
              <StepForward className="w-4 h-4 mr-2" />
              Step
            </Button>
            <Button 
              onClick={onReset} 
              variant="outline"
              disabled={isRunning}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          
          <Separator />
          
          <div className="text-xs text-muted-foreground">
            <p><strong>Start:</strong> Run complete workflow automatically</p>
            <p><strong>Step:</strong> Execute one stage at a time</p>
            <p><strong>Reset:</strong> Clear all state and start over</p>
          </div>
        </CardContent>
      </Card>

      {/* Sample Data */}
      <Card className="ai-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-primary">Sample Scenarios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={() => loadSampleData('billing')}
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            💳 Billing Issue
          </Button>
          <Button
            onClick={() => loadSampleData('technical')}
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            🔧 Technical Problem
          </Button>
          <Button
            onClick={() => loadSampleData('urgent')}
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            🚨 Urgent Escalation
          </Button>
        </CardContent>
      </Card>

      {/* Input Form */}
      <Card className="ai-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-primary">Customer Input</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name" className="text-xs">Customer Name</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                placeholder="Enter customer name"
                className="text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="customer@email.com"
                className="text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-xs">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => 
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="query" className="text-xs">Customer Query</Label>
              <Textarea
                id="query"
                value={formData.query}
                onChange={(e) => setFormData(prev => ({ ...prev, query: e.target.value }))}
                placeholder="Describe the customer's issue or question..."
                rows={4}
                className="text-xs resize-none"
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ControlPanel;