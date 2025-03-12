import { useQuery } from '@tanstack/react-query'
import fetchAPI from '@utils/fetchAPI'
import React, { useEffect, useState } from 'react'

import {
  ContentWrapperWithSidebar,
  DeleteConfirmationModal,
  LayoutWithSidebar,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper,
  Scrollbar
} from '@lifeforge/ui'

import CalendarComponent from './components/Calendar'
import Sidebar from './components/Sidebar'
import {
  type ICalendarCategory,
  type ICalendarEvent
} from './interfaces/calendar_interfaces'
import ModifyCategoryModal from './modals/ModifyCategoryModal'
import ModifyEventModal from './modals/ModifyEventModal'

function CalendarModule(): React.ReactElement {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const rawEventsQuery = useQuery<ICalendarEvent[]>({
    queryKey: ['calendar', 'events'],
    queryFn: () => fetchAPI('calendar/events')
  })
  const categoriesQuery = useQuery<ICalendarCategory[]>({
    queryKey: ['calendar', 'categories'],
    queryFn: () => fetchAPI('calendar/categories')
  })
  const [events, setEvents] = useState<ICalendarEvent[]>([])
  const [modifyEventModalOpenType, setModifyEventModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [
    deleteCategoryConfirmationModalOpen,
    setDeleteCategoryConfirmationModalOpen
  ] = useState(false)
  const [existedData, setExistedData] = useState<ICalendarEvent | null>(null)
  const [modifyCategoryOpenType, setModifyCategoryOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [existedCategoryData, setExistedCategoryData] =
    useState<ICalendarCategory | null>(null)

  useEffect(() => {
    if (rawEventsQuery.isSuccess && rawEventsQuery.data) {
      setEvents(
        rawEventsQuery.data.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }))
      )
    }
  }, [rawEventsQuery.data, rawEventsQuery.isSuccess])

  return (
    <>
      <ModuleWrapper>
        <ModuleHeader icon="tabler:calendar" title="Calendar" />
        <LayoutWithSidebar>
          <Sidebar
            categoriesQuery={categoriesQuery}
            events={events}
            modifyCategoryModalOpenType={modifyCategoryOpenType}
            setDeleteCategoryConfirmationModalOpen={
              setDeleteCategoryConfirmationModalOpen
            }
            setExistedData={setExistedCategoryData}
            setModifyCategoryModalOpenType={setModifyCategoryOpenType}
            setSidebarOpen={setSidebarOpen}
            sidebarOpen={sidebarOpen}
          />
          <ContentWrapperWithSidebar>
            <Scrollbar>
              <div className="mb-8 size-full pr-4">
                <QueryWrapper query={categoriesQuery}>
                  {categories => (
                    <CalendarComponent
                      categories={categories}
                      events={events}
                      setExistedData={setExistedData}
                      setModifyEventModalOpenType={setModifyEventModalOpenType}
                    />
                  )}
                </QueryWrapper>
              </div>
            </Scrollbar>
          </ContentWrapperWithSidebar>
        </LayoutWithSidebar>
      </ModuleWrapper>
      <ModifyEventModal
        categoriesQuery={categoriesQuery}
        existedData={existedData}
        openType={modifyEventModalOpenType}
        setOpenType={setModifyEventModalOpenType}
      />
      <ModifyCategoryModal
        existedData={existedCategoryData}
        openType={modifyCategoryOpenType}
        setOpenType={setModifyCategoryOpenType}
      />
      <DeleteConfirmationModal
        apiEndpoint="calendar/categories"
        data={existedCategoryData}
        isOpen={deleteCategoryConfirmationModalOpen}
        itemName="category"
        nameKey="name"
        queryKey={['calendar', 'categories']}
        onClose={() => {
          setDeleteCategoryConfirmationModalOpen(false)
        }}
      />
    </>
  )
}

export default CalendarModule
