import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  MiniMap,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import WorkflowNode from './WorkflowNode';
import type { StageDefinition, WorkflowState } from '@/types/langraph';
import { stageDefinitions } from '@/lib/langraph-agent';

const nodeTypes = {
  workflow: WorkflowNode,
};

interface WorkflowVisualizationProps {
  workflowState: WorkflowState;
  onNodeClick?: (stageId: string) => void;
}

const WorkflowVisualization = ({ workflowState, onNodeClick }: WorkflowVisualizationProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Create nodes and edges from stage definitions
  useEffect(() => {
    const initialNodes: Node[] = stageDefinitions.map((stage, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const x = col * 250 + 100;
      const y = row * 150 + 100;

      const executionCount = workflowState.stage_history.filter(s => s === stage.id).length;
      const isActive = workflowState.current_stage === stage.id;
      const isCompleted = workflowState.stage_history.includes(stage.id) && !isActive;

      return {
        id: stage.id,
        type: 'workflow',
        position: { x, y },
        data: {
          stage,
          isActive,
          isCompleted,
          executionCount
        }
      };
    });

    const initialEdges: Edge[] = [];
    stageDefinitions.forEach((stage) => {
      stage.next_stages.forEach((nextStageId) => {
        const edgeColor = workflowState.stage_history.includes(stage.id) 
          ? 'hsl(var(--primary))' 
          : 'hsl(var(--muted-foreground))';
          
        initialEdges.push({
          id: `${stage.id}-${nextStageId}`,
          source: stage.id,
          target: nextStageId,
          type: 'smoothstep',
          animated: workflowState.current_stage === stage.id,
          style: { 
            stroke: edgeColor,
            strokeWidth: 2
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: edgeColor
          }
        });
      });
    });

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [workflowState, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      onNodeClick?.(node.id);
    },
    [onNodeClick]
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-background"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="hsl(var(--muted-foreground))" gap={20} size={1} />
        <Controls className="bg-card border border-border" />
        <MiniMap 
          className="bg-card border border-border"
          nodeColor="hsl(var(--primary))"
          maskColor="hsl(var(--background) / 0.8)"
        />
      </ReactFlow>
    </div>
  );
};

export default WorkflowVisualization;