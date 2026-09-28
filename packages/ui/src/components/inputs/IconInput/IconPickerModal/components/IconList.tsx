import { AutoSizer, List } from 'react-virtualized'

import { EmptyStateScreen } from '@/components/feedback'
import { Flex } from '@/components/primitives'

import { IconEntry } from './IconEntry'

export function IconList({
  iconList,
  onIconSelected
}: {
  iconList: string[]
  onIconSelected: (icon: string) => void
}) {
  return (
    <Flex direction="column" flex="1" minHeight="0" mt="md">
      {iconList.length ? (
        <AutoSizer>
          {({ width, height }: { width: number; height: number }) => {
            const itemsPerRow = Math.floor(width / 120) || 1

            return (
              <List
                height={height - 12}
                itemsPerRow={Math.floor(width / iconList.length) || 1}
                rowCount={Math.ceil(iconList.length / itemsPerRow)}
                rowHeight={120}
                rowRenderer={({
                  index,
                  key,
                  style
                }: {
                  index: number
                  key: string
                  style: React.CSSProperties
                }) => {
                  const fromIndex = index * itemsPerRow

                  const toIndex = fromIndex + itemsPerRow

                  return (
                    <Flex key={key} gap="sm" style={style} width="100%">
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
                }}
                width={width}
              />
            )
          }}
        </AutoSizer>
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
