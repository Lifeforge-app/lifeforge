import { CalendarCollectionsSchemas } from 'shared/types/collections'

import { ICalendarEvent } from '@apps/Calendar/components/Calendar'

function MiniCalendarEventIndicator({
  eventsOnTheDay,
  getCategory
}: {
  eventsOnTheDay: ICalendarEvent[]
  getCategory: (
    event: ICalendarEvent
  ) =>
    | (CalendarCollectionsSchemas.ICategoryAggregated & { id: string })
    | undefined
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
