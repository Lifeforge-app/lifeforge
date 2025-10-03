import { type NodeProps } from '@xyflow/react'
import React from 'react'

import GroupNode from '../components/Node/GroupNode'
import { default as NodeComponent } from '../components/Node/Node'
import NODE_CONFIG, { type NODE_TYPES } from '../nodes'

export function createNodeTypes(): Record<
  string,
  React.ComponentType<NodeProps>
> {
  const nodeTypes: Record<string, React.ComponentType<NodeProps>> = {}

  Object.keys(NODE_CONFIG).forEach(key => {
    const Component = NODE_CONFIG[key as NODE_TYPES].component

    nodeTypes[key] = (props: NodeProps) => (
      <NodeComponent {...props} nodeType={key as NODE_TYPES}>
        <Component {...(props as any)} />
      </NodeComponent>
    )
  })

  nodeTypes['group'] = GroupNode

  return nodeTypes
}
