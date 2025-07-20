import { Icon } from '@iconify/react/dist/iconify.js'
import { NodeResizer } from '@xyflow/react'
import clsx from 'clsx'
import { useCallback, useMemo } from 'react'

import { Button, useModalStore } from '@lifeforge/ui'

import usePersonalization from '../../../../../providers/PersonalizationProvider/usePersonalization'
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
        isVisible={selected}
        minWidth={100}
        minHeight={30}
        lineStyle={{
          borderWidth: '1px'
        }}
        handleClassName="size-2.5!"
      />
      <div
        className={clsx(
          'relative h-full transition-colors',
          !selected ? 'border-bg-500' : 'border-bg-900 dark:border-bg-100'
        )}
      >
        <div className="text-bg-100 dark:text-bg-900 flex-between bg-bg-500 absolute -top-3 left-4 max-w-[calc(100%-2rem)] -translate-y-full gap-4 rounded-t-2xl p-2 pl-4">
          <div className="flex w-full min-w-0 items-center gap-3">
            <Icon icon={icon || 'tabler:box'} className="size-8 shrink-0" />
            <span className="w-full min-w-0 truncate text-2xl font-medium">
              {name || 'Untitled Group'}
            </span>
          </div>
          <Button
            onClick={handleOpenConfig}
            icon="tabler:settings"
            variant="plain"
            iconClassName="size-8 text-bg-300 dark:text-bg-700"
          />
        </div>
      </div>
    </>
  )
}

export default GroupNode
