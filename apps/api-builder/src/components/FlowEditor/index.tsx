import {
  Background,
  type Connection,
  Controls,
  type Edge,
  MiniMap,
  type Node,
  ReactFlow,
  ReactFlowProvider
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { ModalManager } from 'lifeforge-ui'

import { usePersonalization } from 'shared/lib'

import ControlPanel from './components/ControlPanel'
import ConnectionLine from './components/Flow/ConnectionLine'
import { default as EdgeComponent } from './components/Flow/Edge'
import { useFlowKeyboardHandlers } from './hooks/useFlowKeyboardHandlers'
import { useFlowPersistence } from './hooks/useFlowPersistence'
import { useFlowStateContext } from './hooks/useFlowStateContext'
import NODE_CONFIG, { type NODE_TYPES } from './nodes'
import { FlowStateProvider } from './providers/FlowStateProvider'
import { createNodeTypes } from './utils/createNodeTypes'
import { isValidConnection } from './utils/isValidConnection'

const NODE_TYPES = createNodeTypes()

function FlowEditor() {
  const { derivedTheme, bgTempPalette } = usePersonalization()

  const flowState = useFlowStateContext()

  useFlowPersistence()
  useFlowKeyboardHandlers()

  return (
    <div className="bg-bg-100 dark:bg-bg-950 h-screen w-screen">
      <ReactFlow
        fitView
        snapToGrid
        colorMode={derivedTheme}
        connectionLineComponent={ConnectionLine}
        edges={flowState.edges}
        edgeTypes={{
          default: EdgeComponent
        }}
        isValidConnection={(connection: Connection | Edge) =>
          isValidConnection(connection, flowState.nodes, flowState.edges)
        }
        minZoom={0.2}
        nodes={flowState.nodes}
        nodeTypes={NODE_TYPES}
        snapGrid={[20, 20]}
        onConnect={flowState.onConnect}
        onEdgesChange={flowState.onEdgesChange}
        onNodeDrag={flowState.onNodeDrag}
        onNodeDragStop={flowState.onNodeDragStop}
        onNodesChange={flowState.onNodesChange}
      >
        <Background
          color={
            derivedTheme === 'dark' ? bgTempPalette[800] : bgTempPalette[400]
          }
          gap={20}
          offset={20}
          size={2}
        />
        <MiniMap
          nodeBorderRadius={6}
          nodeStrokeColor={(node: Node) =>
            NODE_CONFIG[node.type as NODE_TYPES]?.color || bgTempPalette[500]
          }
          nodeStrokeWidth={5}
        />
        <Controls className="bg-bg-800!" />
        <ControlPanel />
      </ReactFlow>
    </div>
  )
}

function FlowEditorWrapper() {
  return (
    <ReactFlowProvider>
      <FlowStateProvider>
        <FlowEditor />
        <ModalManager />
      </FlowStateProvider>
    </ReactFlowProvider>
  )
}

export default FlowEditorWrapper
