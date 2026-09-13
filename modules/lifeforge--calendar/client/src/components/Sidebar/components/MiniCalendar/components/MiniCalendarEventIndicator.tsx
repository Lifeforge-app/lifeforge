import { Box, Flex } from '@lifeforge/ui'

import type {
  CalendarCalendar,
  CalendarCategory,
  CalendarEvent
} from '@/components/Calendar'

function MiniCalendarEventIndicator({
  eventsOnTheDay,
  getCategory,
  getCalendar
}: {
  eventsOnTheDay: CalendarEvent[]
  getCategory: (event: CalendarEvent) => CalendarCategory | undefined
  getCalendar: (event: CalendarEvent) => CalendarCalendar | undefined
}) {
  const groupedByThree = []

  for (let i = 0; i < eventsOnTheDay.length; i += 3) {
    groupedByThree.push(eventsOnTheDay.slice(i, i + 3))
  }

  return (
    <Flex direction="column" gap="xs">
      {groupedByThree.map(group => (
        <Flex key={`group-${group[0].id}`} gap="xs">
          {group.map(event => {
            const category = getCategory(event)

            const calendar = getCalendar(event)

            return (
              <Box
                key={event.id}
                r="full"
                style={{
                  width: '0.25rem',
                  height: '0.25rem',
                  backgroundColor:
                    category?.color || calendar?.color || '#000000'
                }}
              />
            )
          })}
        </Flex>
      ))}
    </Flex>
  )
}

export default MiniCalendarEventIndicator
