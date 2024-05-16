import React from 'react'
import { type ICalendarCategory, type ICalendarEvent } from '@typedec/Calendar'
import CategoryList from './components/CategoryList'
import MiniCalendar from './components/MiniCalendar'

function Sidebar({
  events,
  categories,
  refreshCategories
}: {
  events: ICalendarEvent[]
  categories: ICalendarCategory[] | 'loading' | 'error'
  refreshCategories: () => void
}): React.ReactElement {
  return (
    <aside className="flex h-full w-1/4 min-w-0 shrink-0 grow-0 flex-col gap-4">
      <MiniCalendar events={events} categories={categories} />
      <CategoryList
        categories={categories}
        refreshCategories={refreshCategories}
      />
    </aside>
  )
}

export default Sidebar
