import React, { useEffect, useState } from 'react'
import Scrollbar from '@components/Miscellaneous/Scrollbar'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
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
        <div className="mt-6 flex min-h-0 w-full flex-1">
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
          <div className="flex size-full flex-col xl:ml-8">
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
          </div>
        </div>
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
        updateDataList={() => {
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
