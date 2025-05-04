import {
  ICalendarCategory,
  ICalendarEvent
} from '@apps/Calendar/interfaces/calendar_interfaces'

import EventDetailsDescription from './components/EventDetailsDescription'
import EventDetailsHeader from './components/EventDetailsHeader'

function EventDetails({
  event,
  category
}: {
  event: ICalendarEvent
  category: ICalendarCategory | undefined
}) {
  return (
    <>
      <EventDetailsHeader category={category} event={event} />
      <EventDetailsDescription event={event} />
    </>
  )
}

export default EventDetails
