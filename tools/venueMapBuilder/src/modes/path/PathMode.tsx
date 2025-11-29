import { Icon } from '@iconify/react'
import { Button, Switch } from 'lifeforge-ui'

import { useDrawing } from '../../providers/DrawingProvider'
import { PathEditor } from './PathEditor'
import { PathFinder } from './PathFinder'
import { PathList } from './PathList'
import type { usePath } from './usePath'

interface PathModeProps {
  pathState: ReturnType<typeof usePath>
}

export function PathMode({ pathState }: PathModeProps) {
  const { selectedElementId } = useDrawing()

  return (
    <div className="space-y-4 overflow-auto">
      {!selectedElementId ? (
        <>
          <div className="mt-6 flex items-center justify-between">
            <div className="text-bg-500 flex items-center gap-2">
              <Icon className="size-6" icon="tabler:repeat" />
              <span className="text-lg">New node after plotting</span>
            </div>
            <Switch
              value={pathState.continuousPlotting}
              onChange={() =>
                pathState.setContinuousPlotting(!pathState.continuousPlotting)
              }
            />
          </div>
          <Button
            className="w-full"
            icon="tabler:plus"
            onClick={pathState.handleNewNode}
          >
            New Path Node
          </Button>
          <PathFinder />
          <PathList pathState={pathState} />
        </>
      ) : (
        <PathEditor pathState={pathState} />
      )}
    </div>
  )
}
