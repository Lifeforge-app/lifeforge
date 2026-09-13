import { Flex, TagChip, Text, usePersonalization } from '@lifeforge/ui'

import {
  type TodoListEntry,
  useTodoListContext
} from '@/providers/TodoListProvider'

function TaskTags({ entry }: { entry: TodoListEntry }) {
  const { tagsListQuery } = useTodoListContext()
  const { derivedThemeColor } = usePersonalization()

  const tags = tagsListQuery.data ?? []

  return (
    <Flex align="center" gap="xs" minWidth="0" width="100%">
      {entry.tags?.length > 0 &&
        entry.tags
          .slice(0, 3)
          .map(tag => (
            <TagChip
              key={tag}
              as="span"
              color={derivedThemeColor}
              label={`#${tags.find(t => t.id === tag)?.name}`}
              minWidth="3rem"
              size="sm"
              variant="outlined"
            />
          ))}
      {entry.tags?.length > 3 && (
        <Text color="muted" size="xs" style={{ flexShrink: 0 }}>
          +{entry.tags.length - 3} more
        </Text>
      )}
    </Flex>
  )
}

export default TaskTags
