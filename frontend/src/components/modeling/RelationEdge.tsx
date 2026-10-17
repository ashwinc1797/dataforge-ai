import React from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath, useStore, Position } from 'reactflow';

export default function RelationEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const sourceNode = useStore((store) => store.nodeInternals.get(source));
  const targetNode = useStore((store) => store.nodeInternals.get(target));

  if (!sourceNode || !targetNode) return null;

  const sourceNodeX = sourceNode.positionAbsolute?.x || 0;
  const targetNodeX = targetNode.positionAbsolute?.x || 0;
  
  const sourceNodeWidth = sourceNode.width || 200;
  const targetNodeWidth = targetNode.width || 200;

  // Determine if target is generally to the left of the source (comparing centers)
  const isTargetLeft = targetNodeX + targetNodeWidth / 2 < sourceNodeX + sourceNodeWidth / 2;

  // Dynamically attach to the correct side of the node to avoid overlapping "bends"
  const finalSourceX = isTargetLeft ? sourceNodeX : sourceNodeX + sourceNodeWidth;
  const finalSourcePos = isTargetLeft ? Position.Left : Position.Right;

  const finalTargetX = isTargetLeft ? targetNodeX + targetNodeWidth : targetNodeX;
  const finalTargetPos = isTargetLeft ? Position.Right : Position.Left;

  const [edgePath] = getSmoothStepPath({
    sourceX: finalSourceX,
    sourceY: sourceY, // Stay aligned to the exact row
    sourcePosition: finalSourcePos,
    targetX: finalTargetX,
    targetY: targetY, // Stay aligned to the exact row
    targetPosition: finalTargetPos,
    borderRadius: 0, // Power BI has sharp corners
  });

  const cardinality = data?.cardinality || '1:N';
  const isActive = data?.isActive ?? true;

  const [srcCard, tgtCard] = cardinality.split(':').map((c: string) => c === 'N' ? '*' : c);

  const sourceLabelX = finalSourceX + (finalSourceX < finalTargetX ? 20 : -20);
  const targetLabelX = finalTargetX + (finalSourceX < finalTargetX ? -20 : 20);

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{ 
          ...style, 
          strokeWidth: 2, 
          stroke: isActive ? '#3b82f6' : '#94a3b8',
          strokeDasharray: isActive ? undefined : '5,5'
        }} 
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${sourceLabelX}px,${sourceY}px)`,
            pointerEvents: 'none',
          }}
          className="nodrag nopan"
        >
          <div className="bg-background border shadow-sm px-1.5 py-0.5 rounded text-[10px] font-bold">
            {srcCard}
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${targetLabelX}px,${targetY}px)`,
            pointerEvents: 'none',
          }}
          className="nodrag nopan"
        >
          <div className="bg-background border shadow-sm px-1.5 py-0.5 rounded text-[10px] font-bold">
            {tgtCard}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
