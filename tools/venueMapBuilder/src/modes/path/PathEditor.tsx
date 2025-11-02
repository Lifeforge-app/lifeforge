import { Button, GoBackButton } from 'lifeforge-ui'

import { useDrawing } from '../../providers/DrawingProvider'
import type { usePath } from './usePath'

interface PathEditorProps {
  pathState: ReturnType<typeof usePath>
}

export function PathEditor({ pathState }: PathEditorProps) {
  const { clearDrawingAndDeselect, isConnectingNodes, setIsConnectingNodes } =
    useDrawing()

  const node = pathState.selectedNode

  if (!node) {
    return null
  }

  return (
    <>
      <GoBackButton onClick={clearDrawingAndDeselect} />
      <div className="border-bg-800 mt-4 rounded-md border-2 p-4">
        <div className="text-bg-500 mb-4 text-sm font-medium">
          Path Node Settings
        </div>

        <div className="space-y-2">
          <div className="component-bg-lighter w-full space-y-2 rounded-md p-3">
            <span className="text-bg-500 text-sm font-medium">
              X Coordinate
            </span>
            <input
              className="w-full"
              type="number"
              value={node.coordinate[0]}
              onChange={e =>
                pathState.handleCoordinateChange(
                  0,
                  parseFloat(e.target.value) || 0
                )
              }
            />
          </div>
          <div className="component-bg-lighter w-full space-y-2 rounded-md p-3">
            <span className="text-bg-500 text-sm font-medium">
              Y Coordinate
            </span>
            <input
              className="w-full"
              type="number"
              value={node.coordinate[1]}
              onChange={e =>
                pathState.handleCoordinateChange(
                  1,
                  parseFloat(e.target.value) || 0
                )
              }
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-bg-500 mb-2 text-sm font-medium">
            Connections ({node.connectedNodeIds.length})
          </div>

          {pathState.pathNodes.filter(n => n.id !== node.id).length > 0 && (
            <Button
              className="mb-2 w-full"
              icon={
                isConnectingNodes ? 'tabler:check' : 'tabler:vector-triangle'
              }
              variant={isConnectingNodes ? 'primary' : 'secondary'}
              onClick={() => setIsConnectingNodes(!isConnectingNodes)}
            >
              {isConnectingNodes ? 'Done Connecting' : 'Click Nodes to Connect'}
            </Button>
          )}

          {node.connectedNodeIds.length > 0 ? (
            <div className="space-y-2">
              {node.connectedNodeIds.map(connectedId => {
                const connectedNode = pathState.pathNodes.find(
                  n => n.id === connectedId
                )

                if (!connectedNode) return null

                return (
                  <div
                    key={connectedId}
                    className="component-bg-lighter flex items-center justify-between rounded-md p-3"
                  >
                    <span className="text-bg-500 text-sm">
                      Node {pathState.pathNodes.indexOf(connectedNode) + 1}
                    </span>
                    <Button
                      dangerous
                      icon="tabler:unlink"
                      variant="plain"
                      onClick={() =>
                        pathState.handleToggleConnection(connectedId)
                      }
                    />
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="component-bg-lighter rounded-md p-3 text-center">
              <span className="text-bg-500 text-sm">
                No connections yet. Click &quot;Click Nodes to Connect&quot; to
                add connections.
              </span>
            </div>
          )}
        </div>

        <Button
          dangerous
          className="mt-4 w-full"
          icon="tabler:trash"
          variant="secondary"
          onClick={pathState.handleDeleteNode}
        >
          Delete Node
        </Button>
      </div>
    </>
  )
}
