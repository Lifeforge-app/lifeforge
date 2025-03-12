import { UseQueryResult } from '@tanstack/react-query'
import React from 'react'

import { QueryWrapper, SidebarWrapper } from '@lifeforge/ui'

import {
  type ICalendarCategory,
  type ICalendarEvent
} from '../../interfaces/calendar_interfaces'
import CategoryList from './components/CategoryList'
import MiniCalendar from './components/MiniCalendar'

function Sidebar({
  events,
  categoriesQuery,
  sidebarOpen,
  setSidebarOpen,
  setModifyCategoryModalOpenType,
  setExistedData,
  setDeleteCategoryConfirmationModalOpen
}: {
  events: ICalendarEvent[]
  categoriesQuery: UseQueryResult<ICalendarCategory[]>
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
      <QueryWrapper query={categoriesQuery}>
        {categories => (
          <>
            <MiniCalendar categories={categories} events={events} />
            <CategoryList
              categories={categories}
              setDeleteCategoryConfirmationModalOpen={
                setDeleteCategoryConfirmationModalOpen
              }
              setExistedData={setExistedData}
              setModifyCategoryModalOpenType={setModifyCategoryModalOpenType}
            />
          </>
        )}
      </QueryWrapper>
    </SidebarWrapper>
  )
}

export default Sidebar
