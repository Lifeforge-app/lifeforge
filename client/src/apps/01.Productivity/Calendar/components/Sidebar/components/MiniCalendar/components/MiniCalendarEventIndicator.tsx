import type {
  CalendarCategory,
  CalendarEvent
} from '@apps/01.Productivity/calendar/components/Calendar'

function MiniCalendarEventIndicator({
  eventsOnTheDay,
  getCategory
}: {
  eventsOnTheDay: CalendarEvent[]
  getCategory: (event: CalendarEvent) => CalendarCategory | undefined
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

            return (
              <div
                key={event.id}
                className="size-1 rounded-full"
                style={{
                  backgroundColor: category?.color ?? ''
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
