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
    <div className="space-y-px">
      {groupedByThree.map(group => (
        <div key={`group-${group[0].id}`} className="flex gap-px">
          {group.map(event => {
            const category = getCategory(event)

            const calendar = getCalendar(event)

            return (
              <div
                key={event.id}
                className="size-1 rounded-full"
                style={{
                  backgroundColor:
                    category?.color || calendar?.color || '#000000'
                }}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default MiniCalendarEventIndicator
