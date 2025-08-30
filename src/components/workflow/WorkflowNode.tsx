import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import type { StageDefinition } from '@/types/langraph';

interface WorkflowNodeProps {
  data: {
    stage: StageDefinition;
    isActive: boolean;
    isCompleted: boolean;
    executionCount: number;
  };
}

const WorkflowNode = memo(({ data }: WorkflowNodeProps) => {
  const { stage, isActive, isCompleted, executionCount } = data;

  const getStageColor = (stageId: string) => {
    const colorMap: Record<string, string> = {
      intake: 'stage-intake',
      understand: 'stage-understand', 
      prepare: 'stage-prepare',
      ask: 'stage-ask',
      wait: 'stage-wait',
      retrieve: 'stage-retrieve',
      decide: 'stage-decide',
      update: 'stage-update',
      create: 'stage-create',
      do: 'stage-do',
      complete: 'stage-complete'
    };
    return colorMap[stageId] || 'stage-intake';
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'deterministic': return 'bg-info/20 text-info';
      case 'non-deterministic': return 'bg-warning/20 text-warning';
      case 'human': return 'bg-accent/20 text-accent-foreground';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  return (
    <div className={`
      ai-card p-4 min-w-[200px] text-center relative overflow-hidden
      ${isActive ? 'stage-active ring-2 ring-primary' : ''}
      ${isCompleted ? 'opacity-75' : ''}
    `}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 border-2 border-background"
        style={{ background: `hsl(var(--${getStageColor(stage.id)}))` }}
      />
      
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">{stage.emoji}</span>
          <span className={`text-sm font-semibold ${getStageColor(stage.id)}`}>
            {stage.name}
          </span>
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-2">
          {stage.description}
        </p>

        {/* Abilities with server indicators */}
        {stage.abilities.length > 0 && (
          <div className="space-y-1">
            {stage.abilities.slice(0, 3).map((ability, index) => (
              <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="text-[10px]">
                  {ability.server === 'ATLAS' ? '🔵' : '🟢'}
                </span>
                <span className="truncate">• {ability.name}</span>
              </div>
            ))}
            {stage.abilities.length > 3 && (
              <div className="text-xs text-muted-foreground">
                +{stage.abilities.length - 3} more...
              </div>
            )}
          </div>
        )}
        
        <div className="flex flex-wrap gap-1 justify-center">
          <Badge variant="outline" className={getModeColor(stage.mode)}>
            {stage.mode}
          </Badge>
          {stage.abilities.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {stage.abilities.length} abilities
            </Badge>
          )}
        </div>

        {executionCount > 0 && (
          <div className="absolute top-1 right-1">
            <Badge variant="secondary" className="text-xs">
              {executionCount}
            </Badge>
          </div>
        )}

        {isActive && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-primary/10 animate-pulse rounded-lg" />
          </div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 border-2 border-background"
        style={{ background: `hsl(var(--${getStageColor(stage.id)}))` }}
      />
    </div>
  );
});

WorkflowNode.displayName = 'WorkflowNode';

export default WorkflowNode;