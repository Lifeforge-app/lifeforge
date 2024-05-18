/* eslint-disable @typescript-eslint/indent */
import React from 'react'
import { type ICalendarCategory, type ICalendarEvent } from '@typedec/Calendar'

export default function EventItem({
  event,
  categories,
  setModifyEventModalOpenType,
  setExistedData
}: {
  event: ICalendarEvent
  categories: ICalendarCategory[] | 'loading' | 'error'
  setModifyEventModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: React.Dispatch<React.SetStateAction<ICalendarEvent | null>>
}): React.ReactElement {
  return (
    <div
      onClick={() => {
        setModifyEventModalOpenType('update')
        setExistedData(event)
      }}
      className="rbc-event flex items-center gap-2 rounded-md bg-bg-800"
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
    </div>
  )
}
