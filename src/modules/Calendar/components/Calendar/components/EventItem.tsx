import React from 'react'
import {
  type ICalendarCategory,
  type ICalendarEvent
} from '@interfaces/calendar_interfaces'
import { type Loadable } from '@interfaces/common'

export default function EventItem({
  event,
  categories,
  setModifyEventModalOpenType,
  setExistedData
}: {
  event: ICalendarEvent
  categories: Loadable<ICalendarCategory[]>
  setModifyEventModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: React.Dispatch<React.SetStateAction<ICalendarEvent | null>>
}): React.ReactElement {
  return (
    <button
      onClick={() => {
        setModifyEventModalOpenType('update')
        setExistedData(event)
      }}
      className="rbc-event flex flex-row! items-center gap-2 rounded-md bg-bg-100 dark:bg-bg-800"
      style={{
        border: 'none'
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
