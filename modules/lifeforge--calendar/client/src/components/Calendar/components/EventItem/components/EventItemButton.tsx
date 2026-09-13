import { memo } from 'react'

import { Flex, Icon, Text } from '@lifeforge/ui'

function EventItemButton({
  id,
  title,
  color,
  icon,
  isStrikethrough
}: {
  id: string
  title: string
  color: string
  icon: string
  isStrikethrough?: boolean
}) {
  return (
    <Flex
      align="start"
      as="button"
      bg={{ base: 'bg-300', dark: 'bg-800' }}
      data-tooltip-id={`calendar-event-${id}`}
      r="md"
      style={{
        backgroundColor: `${color}33`,
        // @ts-expect-error - CSS variable not recognized
        '--category-color': color,
        padding: '2px 5px'
      }}
      width="100%"
    >
      <Flex align="center" gap="xs" minWidth="0" width="100%">
        {icon && <Icon icon={icon} style={{ color, flexShrink: 0 }} />}
        <Text
          truncate
          align="left"
          decoration={isStrikethrough ? 'line-through' : undefined}
          style={{ color }}
        >
          {title}
        </Text>
      </Flex>
    </Flex>
  )
}

export default memo(EventItemButton)
