import React from 'react'
import SidebarWrapper from '@components/Sidebar/components/SidebarWrapper'
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
  setExistedData,
  searchParams,
  setSearchParams,
  setDeleteCategoryConfirmationModalOpen
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
  searchParams: URLSearchParams
  setSearchParams: (params: Record<string, string> | URLSearchParams) => void
  setDeleteCategoryConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
}): React.ReactElement {
  return (
    <SidebarWrapper isOpen={sidebarOpen} setOpen={setSidebarOpen}>
      <MiniCalendar events={events} categories={categories} />
      <CategoryList
        categories={categories}
        refreshCategories={refreshCategories}
        modifyCategoryModalOpenType={modifyCategoryModalOpenType}
        setModifyCategoryModalOpenType={setModifyCategoryModalOpenType}
        setExistedData={setExistedData}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        setDeleteCategoryConfirmationModalOpen={
          setDeleteCategoryConfirmationModalOpen
        }
      />
    </SidebarWrapper>
  )
}

export default Sidebar
