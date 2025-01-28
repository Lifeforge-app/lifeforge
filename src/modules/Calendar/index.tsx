import React, { useEffect, useState } from 'react'
import ContentWrapperWithSidebar from '@components/layouts/module/ContentWrapperWithSidebar'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import SidebarAndContentWrapper from '@components/layouts/module/SidebarAndContentWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import Scrollbar from '@components/utilities/Scrollbar'
import useFetch from '@hooks/useFetch'
import useHashParams from '@hooks/useHashParams'
import {
  type ICalendarCategory,
  type ICalendarEvent
} from '@interfaces/calendar_interfaces'
import CalendarComponent from './components/Calendar'
import Sidebar from './components/Sidebar'
import ModifyCategoryModal from './modals/ModifyCategoryModal'
import ModifyEventModal from './modals/ModifyEventModal'

function CalendarModule(): React.ReactElement {
  const [searchParams, setSearchParams] = useHashParams()
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
        <ModuleHeader title="Calendar" icon="tabler:calendar" />
        <SidebarAndContentWrapper>
          <Sidebar
            events={events}
            categories={categories}
            refreshCategories={refreshCategories}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            modifyCategoryModalOpenType={modifyCategoryOpenType}
            setModifyCategoryModalOpenType={setModifyCategoryOpenType}
            setExistedData={setExistedCategoryData}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            setDeleteCategoryConfirmationModalOpen={
              setDeleteCategoryConfirmationModalOpen
            }
          />
          <ContentWrapperWithSidebar>
            <Scrollbar>
              <div className="mb-8 size-full pr-4">
                <CalendarComponent
                  events={events}
                  setRawEvents={setRawEvents}
                  categories={categories}
                  setModifyEventModalOpenType={setModifyEventModalOpenType}
                  setExistedData={setExistedData}
                  refreshRawEvents={refreshRawEvents}
                  searchParams={searchParams}
                />
              </div>
            </Scrollbar>
          </ContentWrapperWithSidebar>
        </SidebarAndContentWrapper>
      </ModuleWrapper>
      <ModifyEventModal
        openType={modifyEventModalOpenType}
        setOpenType={setModifyEventModalOpenType}
        existedData={existedData}
        updateEventList={() => {
          refreshRawEvents()
          refreshCategories()
        }}
        categories={categories}
      />
      <ModifyCategoryModal
        openType={modifyCategoryOpenType}
        setOpenType={setModifyCategoryOpenType}
        existedData={existedCategoryData}
        refreshCategories={refreshCategories}
      />
      <DeleteConfirmationModal
        apiEndpoint="calendar/category"
        isOpen={deleteCategoryConfirmationModalOpen}
        onClose={() => {
          setDeleteCategoryConfirmationModalOpen(false)
        }}
        data={existedCategoryData}
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
      />
    </>
  )
}

export default CalendarModule
