import { Icon } from '@iconify/react'
import { NodeResizer } from '@xyflow/react'
import clsx from 'clsx'
import { Button, useModalStore } from 'lifeforge-ui'
import { useCallback, useMemo } from 'react'
import { usePersonalization } from 'shared'

import { useFlowStateContext } from '../../../hooks/useFlowStateContext'
import GroupNodeConfigModal from './components/GroupNodeConfigModal'

function GroupNode({ selected, id }: { selected: boolean; id: string }) {
  const { derivedThemeColor } = usePersonalization()

  const open = useModalStore(s => s.open)

  const { getNodeData } = useFlowStateContext()

  const { name, icon } = useMemo(
    () => getNodeData<{ name: string; icon: string }>(id),
    [getNodeData, id]
  )

  const handleOpenConfig = useCallback(() => {
    open(GroupNodeConfigModal, {
      nodeId: id
    })
  }, [open, id])

  return (
    <>
      <NodeResizer
        color={derivedThemeColor}
        handleClassName="size-2.5!"
        isVisible={selected}
        lineStyle={{
          borderWidth: '1px'
        }}
        minHeight={30}
        minWidth={100}
      />
      <div
        className={clsx(
          'relative h-full transition-colors',
          !selected ? 'border-bg-500' : 'border-bg-900 dark:border-bg-100'
        )}
      >
        <div className="text-bg-100 dark:text-bg-800 flex-between bg-bg-500 absolute -top-3 left-4 max-w-[calc(100%-2rem)] -translate-y-full gap-3 rounded-t-2xl p-2 pl-4">
          <div className="flex w-full min-w-0 items-center gap-3">
            <Icon className="size-8 shrink-0" icon={icon || 'tabler:box'} />
            <span className="w-full min-w-0 truncate text-2xl font-medium">
              {name || 'Untitled Group'}
            </span>
          </div>
          <Button
            icon="tabler:settings"
            iconClassName="size-8 text-bg-300 dark:text-bg-700"
            variant="plain"
            onClick={handleOpenConfig}
          />
        </div>
      </div>
    </>
  )
}

export default GroupNode
