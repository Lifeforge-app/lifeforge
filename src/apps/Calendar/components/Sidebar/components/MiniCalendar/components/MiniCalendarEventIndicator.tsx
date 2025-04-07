import { ICalendarEvent } from '@apps/Calendar/interfaces/calendar_interfaces'

function MiniCalendarEventIndicator({
  eventsOnTheDay,
  getBgColor
}: {
  eventsOnTheDay: ICalendarEvent[]
  getBgColor: (event: ICalendarEvent) => string | undefined
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
            const backgroundColor = getBgColor(event)

            return (
              <div
                key={event.id}
                className="size-1 rounded-full"
                style={{
                  backgroundColor: backgroundColor ?? ''
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
