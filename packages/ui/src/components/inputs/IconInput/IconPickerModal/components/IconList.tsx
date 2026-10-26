import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

import { EmptyStateScreen } from '@/components/feedback'
import { Flex } from '@/components/primitives'
import useDivSize from '@/hooks/useDivSize'

import { IconEntry } from './IconEntry'

const ROW_HEIGHT = 120
const ICON_WIDTH = 120

export function IconList({
  iconList,
  onIconSelected
}: {
  iconList: string[]
  onIconSelected: (icon: string) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { width } = useDivSize(scrollRef)

  const itemsPerRow = Math.max(1, Math.floor(width / ICON_WIDTH))
  const rowCount = Math.ceil(iconList.length / itemsPerRow)

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 3
  })

  return (
    <Flex direction="column" flex="1" minHeight="0" mt="md">
      {iconList.length ? (
        <div
          ref={scrollRef}
          style={{ height: '100%', overflowY: 'auto', width: '100%' }}
        >
          <div
            style={{
              height: virtualizer.getTotalSize(),
              position: 'relative',
              width: '100%'
            }}
          >
            {virtualizer.getVirtualItems().map(row => {
              const fromIndex = row.index * itemsPerRow

              const toIndex = fromIndex + itemsPerRow

              return (
                <Flex
                  key={row.key}
                  gap="sm"
                  style={{
                    height: row.size,
                    left: 0,
                    position: 'absolute',
                    top: 0,
                    transform: `translateY(${row.start}px)`,
                    width: '100%'
                  }}
                >
                  {iconList.slice(fromIndex, toIndex).map(icon => (
                    <IconEntry
                      key={icon}
                      icon={icon.split(':').pop() ?? ''}
                      iconSet={icon.split(':').shift() ?? ''}
                      onIconSelected={onIconSelected}
                    />
                  ))}
                </Flex>
              )
            })}
          </div>
        </div>
      ) : (
        <Flex align="center" flex="1" height="100%" justify="center">
          <EmptyStateScreen
            icon="tabler:icons-off"
            message={{
              id: 'icon',
              namespace: 'common.modals',
              tKey: 'iconPicker'
            }}
          />
        </Flex>
      )}
    </Flex>
  )
}
