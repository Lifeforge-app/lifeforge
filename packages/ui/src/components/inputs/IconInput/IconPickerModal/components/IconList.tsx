import { EmptyStateScreen } from '@/components/feedback'
import { VirtualGrid } from '@/components/layout'
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
        <VirtualGrid
          defaultRowHeight={120}
          fixedRowHeight={120}
          getItemKey={icon => icon}
          itemMinWidth={120}
          items={iconList}
          renderItem={icon => (
            <IconEntry
              icon={icon.split(':').pop() ?? ''}
              iconSet={icon.split(':').shift() ?? ''}
              onIconSelected={onIconSelected}
            />
          )}
        />
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
