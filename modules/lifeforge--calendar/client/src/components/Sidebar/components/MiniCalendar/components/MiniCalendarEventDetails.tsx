import dayjs from 'dayjs'
import { createPortal } from 'react-dom'
import { Tooltip } from 'react-tooltip'

import { Box, Flex, Icon, Text, vars } from '@lifeforge/ui'

import type {
  CalendarCalendar,
  CalendarCategory,
  CalendarEvent
} from '@/components/Calendar'

function MiniCalendarEventDetails({
  index,
  actualIndex,
  date,
  eventsOnTheDay,
  getCategory,
  getCalendar
}: {
  index: number
  actualIndex: number
  date: Date
  eventsOnTheDay: CalendarEvent[]
  getCategory: (event: CalendarEvent) => CalendarCategory | undefined
  getCalendar: (event: CalendarEvent) => CalendarCalendar | undefined
}) {
  return createPortal(
    <Box
      asChild
      shadow
      bg={{ base: 'bg-50', dark: 'bg-800' }}
      p="sm"
      r="md"
      style={{ zIndex: 9999 }}
    >
      <Tooltip
        noArrow
        id={`calendar-tooltip-${index}`}
        opacity={1}
        place="bottom"
        positionStrategy="absolute"
        style={{
          borderRadius: vars.radii.md
        }}
      >
        <Box
          maxHeight="24rem"
          maxWidth="24rem"
          minWidth="16rem"
          overflowY="auto"
          position="relative"
        >
          <Flex align="start" gap="2xl" justify="between">
            <Text
              as="h3"
              color={{ base: 'bg-800', dark: 'bg-100' }}
              size="xl"
              weight="semibold"
            >
              {dayjs(
                `${date.getFullYear()}-${date.getMonth() + 1}-${actualIndex}`,
                'YYYY-M-D'
              ).format('dddd, MMMM D')}
            </Text>
          </Flex>
          <Flex direction="column" gap="sm" mt="md">
            {eventsOnTheDay.map(event => {
              const category = getCategory(event)

              const calendar = getCalendar(event)

              return (
                <Flex
                  key={event.id}
                  align="center"
                  gap="sm"
                  pl="md"
                  style={{
                    position: 'relative'
                  }}
                >
                  <Box
                    height="100%"
                    left="0"
                    position="absolute"
                    r="full"
                    style={{
                      transform: 'translateY(-50%)',
                      backgroundColor: 'var(--bg-color)',
                      // @ts-expect-error - CSS Variables
                      '--bg-color':
                        category?.color || calendar?.color || '#000000'
                    }}
                    top="50%"
                    width="0.25rem"
                  />
                  {category && <Icon icon={category.icon ?? ''} size="1em" />}
                  <Text
                    color="muted"
                    decoration={
                      event.is_strikethrough ? 'line-through' : undefined
                    }
                  >
                    {event.title}
                  </Text>
                </Flex>
              )
            })}
          </Flex>
        </Box>
      </Tooltip>
    </Box>,
    document.body
  )
}

export default MiniCalendarEventDetails
