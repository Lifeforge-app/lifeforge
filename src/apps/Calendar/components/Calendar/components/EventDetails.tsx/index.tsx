import {
  ICalendarCategory,
  ICalendarEvent
} from '@apps/Calendar/interfaces/calendar_interfaces'

import EventDetailsDescription from './components/EventDetailsDescription'
import EventDetailsHeader from './components/EventDetailsHeader'

function EventDetails({
  event,
  category,
  setModifyEventModalOpenType,
  setExistedData,
  setIsDeleteEventConfirmationModalOpen
}: {
  event: ICalendarEvent
  category: ICalendarCategory | undefined
  setModifyEventModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: React.Dispatch<React.SetStateAction<ICalendarEvent | null>>
  setIsDeleteEventConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
}) {
  return (
    <>
      <EventDetailsHeader
        category={category}
        event={event}
        setExistedData={setExistedData}
        setIsDeleteEventConfirmationModalOpen={
          setIsDeleteEventConfirmationModalOpen
        }
        setModifyEventModalOpenType={setModifyEventModalOpenType}
      />
      <EventDetailsDescription event={event} />
    </>
  )
}

export default EventDetails
