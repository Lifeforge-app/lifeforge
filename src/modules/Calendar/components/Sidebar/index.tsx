import React from 'react'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import {
  type ICalendarCategory,
  type ICalendarEvent
} from '@interfaces/calendar_interfaces'
import CategoryList from './components/CategoryList'
import MiniCalendar from './components/MiniCalendar'

function Sidebar({
  events,
  categories,
  refreshCategories,
  sidebarOpen,
  setSidebarOpen,
  modifyCategoryModalOpenType,
  setModifyCategoryModalOpenType,
  setExistedData
}: {
  events: ICalendarEvent[]
  categories: ICalendarCategory[] | 'loading' | 'error'
  refreshCategories: () => void
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
  modifyCategoryModalOpenType: 'create' | 'update' | null
  setModifyCategoryModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: React.Dispatch<React.SetStateAction<ICalendarCategory | null>>
}): React.ReactElement {
  return (
    <aside
      className={`absolute ${
        sidebarOpen ? 'left-0' : 'left-full'
      } top-0 z-[9999] size-full shrink-0 overflow-y-scroll rounded-lg bg-bg-50 py-4 shadow-custom duration-300 dark:bg-bg-900 xl:static xl:h-[calc(100%-2rem)] xl:w-3/12`}
    >
      <div className="flex items-center justify-between px-8 py-4 xl:hidden">
        <GoBackButton
          onClick={() => {
            setSidebarOpen(false)
          }}
        />
      </div>
      <MiniCalendar events={events} categories={categories} />
      <CategoryList
        categories={categories}
        refreshCategories={refreshCategories}
        modifyCategoryModalOpenType={modifyCategoryModalOpenType}
        setModifyCategoryModalOpenType={setModifyCategoryModalOpenType}
        setExistedData={setExistedData}
      />
    </aside>
  )
}

export default Sidebar
