import React from 'react';
import ReactFlow, { Background, Controls } from 'react-flow-renderer';

const fitView = (reactFlowInstance) => {
  reactFlowInstance.fitView();
};

export default ({ elements, style, ...props }) => (
  <div
    style={{
      height: 425,
      background: 'white',
      borderRadius: '4px',
      padding: '4px',
      ...style,
    }}
  >
    <ReactFlow
      elements={elements}
      grid={true}
      nodesDraggable={false}
      onLoad={fitView}
      onMove={fitView}
      nodesConnectable={false}
      elementsSelectable={false}
      {...props}
    >
      <Background variant="dots" gap={10} size={0.5} />
      {/* <MiniMap /> */}
      <Controls />
    </ReactFlow>
  </div>
);
