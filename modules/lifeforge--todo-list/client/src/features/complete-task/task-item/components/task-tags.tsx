import { Box, Flex, Text } from '@lifeforge/ui'

import { type Task, useTodoListContext } from '@/entities/task'

import * as styles from '../task-item.css'

export function TaskTags({ entry }: { entry: Task }) {
  const { tagsListQuery } = useTodoListContext()

  const tags = tagsListQuery.data ?? []
  const taskTags = entry.tags ?? []
  const visibleTags = taskTags.slice(0, 3)
  const remainingTagCount = Math.max(taskTags.length - 3, 0)
  const hasMoreTags = remainingTagCount > 0
  const tagElements = visibleTags.map(tag => {
    const tagName = tags.find(item => item.id === tag)?.name

    return (
      <Text key={tag} className={styles.tag}>
        <Box aria-hidden="true" as="span" className={styles.tagBackground} />#
        {tagName}
      </Text>
    )
  })

  return (
    <Flex align="center" gap="xs" minWidth="0" width="100%">
      {tagElements}
      {hasMoreTags && (
        <Text className={styles.moreTags} size="xs">
          +{remainingTagCount} more
        </Text>
      )}
    </Flex>
  )
}
