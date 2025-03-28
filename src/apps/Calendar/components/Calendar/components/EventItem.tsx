import {
  type ICalendarCategory,
  type ICalendarEvent
} from '../../../interfaces/calendar_interfaces'

export default function EventItem({
  event,
  categories,
  setModifyEventModalOpenType,
  setExistedData
}: {
  event: ICalendarEvent
  categories: ICalendarCategory[]
  setModifyEventModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: React.Dispatch<React.SetStateAction<ICalendarEvent | null>>
}) {
  return (
    <button
      className="rbc-event bg-bg-100 dark:bg-bg-800 flex flex-row! flex-nowrap! items-center gap-2 rounded-md"
      style={{
        border: 'none'
      }}
      onClick={() => {
        setModifyEventModalOpenType('update')
        setExistedData(event)
      }}
    >
      {typeof categories !== 'string' && event.category !== '' && (
        <span
          className="h-4 w-1 shrink-0 rounded-full"
          style={{
            backgroundColor: categories.find(
              category => category.id === event.category
            )?.color
          }}
        />
      )}
      <span className="truncate">{event.title}</span>
    </button>
  )
}
