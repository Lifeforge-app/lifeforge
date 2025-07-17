import {
  ICalendarCategory,
  ICalendarEvent
} from '@apps/Calendar/interfaces/calendar_interfaces'

import EventDetailsDescription from './components/EventDetailsDescription'
import EventDetailsHeader from './components/EventDetailsHeader'

function EventDetails({
  event,
  category,
  editable = true
}: {
  event: ICalendarEvent
  category: ICalendarCategory | undefined
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
