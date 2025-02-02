import React, { useEffect, useState } from 'react'
import ContentWrapperWithSidebar from '@components/layouts/module/ContentWrapperWithSidebar'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import SidebarAndContentWrapper from '@components/layouts/module/SidebarAndContentWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import Scrollbar from '@components/utilities/Scrollbar'
import useFetch from '@hooks/useFetch'
import {
  type ICalendarCategory,
  type ICalendarEvent
} from '@interfaces/calendar_interfaces'
import CalendarComponent from './components/Calendar'
import Sidebar from './components/Sidebar'
import ModifyCategoryModal from './modals/ModifyCategoryModal'
import ModifyEventModal from './modals/ModifyEventModal'

function CalendarModule(): React.ReactElement {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [rawEvents, refreshRawEvents, setRawEvents] =
    useFetch<ICalendarEvent[]>('calendar/event')
  const [categories, refreshCategories, setCategories] =
    useFetch<ICalendarCategory[]>('calendar/category')
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
    if (typeof rawEvents !== 'string') {
      setEvents(
        rawEvents.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }))
      )
    }
  }, [rawEvents])

  return (
    <>
      <ModuleWrapper>
        <ModuleHeader icon="tabler:calendar" title="Calendar" />
        <SidebarAndContentWrapper>
          <Sidebar
            categories={categories}
            events={events}
            modifyCategoryModalOpenType={modifyCategoryOpenType}
            refreshCategories={refreshCategories}
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
                <CalendarComponent
                  categories={categories}
                  events={events}
                  refreshRawEvents={refreshRawEvents}
                  setExistedData={setExistedData}
                  setModifyEventModalOpenType={setModifyEventModalOpenType}
                  setRawEvents={setRawEvents}
                />
              </div>
            </Scrollbar>
          </ContentWrapperWithSidebar>
        </SidebarAndContentWrapper>
      </ModuleWrapper>
      <ModifyEventModal
        categories={categories}
        existedData={existedData}
        openType={modifyEventModalOpenType}
        setOpenType={setModifyEventModalOpenType}
        updateEventList={() => {
          refreshRawEvents()
          refreshCategories()
        }}
      />
      <ModifyCategoryModal
        existedData={existedCategoryData}
        openType={modifyCategoryOpenType}
        refreshCategories={refreshCategories}
        setOpenType={setModifyCategoryOpenType}
      />
      <DeleteConfirmationModal
        apiEndpoint="calendar/category"
        data={existedCategoryData}
        isOpen={deleteCategoryConfirmationModalOpen}
        itemName="category"
        nameKey="name"
        updateDataLists={() => {
          if (typeof categories === 'string') return

          setCategories(
            categories.filter(
              category => category.id !== existedCategoryData?.id
            )
          )
        }}
        onClose={() => {
          setDeleteCategoryConfirmationModalOpen(false)
        }}
      />
    </>
  )
}

export default CalendarModule
