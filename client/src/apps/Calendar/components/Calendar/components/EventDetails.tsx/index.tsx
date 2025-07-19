import {
  CalendarCollectionsSchemas,
  ISchemaWithPB
} from 'shared/types/collections'

import { ICalendarEvent } from '../..'
import EventDetailsDescription from './components/EventDetailsDescription'
import EventDetailsHeader from './components/EventDetailsHeader'

function EventDetails({
  event,
  category,
  editable = true
}: {
  event: ICalendarEvent
  category:
    | ISchemaWithPB<CalendarCollectionsSchemas.ICategoryAggregated>
    | undefined
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
