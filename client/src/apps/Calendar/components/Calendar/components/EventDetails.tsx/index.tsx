import type { CalendarCategory, CalendarEvent } from '../..'
import EventDetailsDescription from './components/EventDetailsDescription'
import EventDetailsHeader from './components/EventDetailsHeader'

function EventDetails({
  event,
  category,
  editable = true
}: {
  event: CalendarEvent
  category: CalendarCategory | undefined
  editable?: boolean
}) {
  return (
    <>
      <EventDetailsHeader
        category={category}
        editable={editable}
        event={event}
      />
      <EventDetailsDescription event={event} />
    </>
  )
}

export default EventDetails
