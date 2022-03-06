import React from 'react';
import ReactFlow, { Controls, Background, BackgroundVariant, OnLoadFunc } from 'react-flow-renderer';

const onLoad: OnLoadFunc = (flow) => {
  flow.fitView();
};

const Flowchart: React.FC<any> = ({ elements, style, ...props }) => (
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
      // @ts-ignore
      grid={true}
      nodesDraggable={false}
      onLoad={onLoad}
      nodesConnectable={false}
      elementsSelectable={false}
      {...props}
    >
      <Background variant={BackgroundVariant.Dots} gap={10} size={0.5} />
      {/* <MiniMap /> */}
      <Controls />
    </ReactFlow>
  </div>
);

export default Flowchart;
