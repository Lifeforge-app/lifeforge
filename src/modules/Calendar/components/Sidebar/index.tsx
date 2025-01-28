import React from 'react'
import { SidebarWrapper } from '@components/layouts/sidebar'
import {
  type ICalendarCategory,
  type ICalendarEvent
} from '@interfaces/calendar_interfaces'
import { type Loadable } from '@interfaces/common'
import CategoryList from './components/CategoryList'
import MiniCalendar from './components/MiniCalendar'

function Sidebar({
  events,
  categories,
  sidebarOpen,
  setSidebarOpen,
  setModifyCategoryModalOpenType,
  setExistedData,
  setDeleteCategoryConfirmationModalOpen
}: {
  events: ICalendarEvent[]
  categories: Loadable<ICalendarCategory[]>
  refreshCategories: () => void
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
  modifyCategoryModalOpenType: 'create' | 'update' | null
  setModifyCategoryModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: React.Dispatch<React.SetStateAction<ICalendarCategory | null>>
  setDeleteCategoryConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
}): React.ReactElement {
  return (
    <SidebarWrapper isOpen={sidebarOpen} setOpen={setSidebarOpen}>
      <MiniCalendar events={events} categories={categories} />
      <CategoryList
        categories={categories}
        setModifyCategoryModalOpenType={setModifyCategoryModalOpenType}
        setExistedData={setExistedData}
        setDeleteCategoryConfirmationModalOpen={
          setDeleteCategoryConfirmationModalOpen
        }
      />
    </SidebarWrapper>
  )
}

export default Sidebar
