import React, { useEffect, useState } from 'react'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import useFetch from '@hooks/useFetch'
import { type ICalendarCategory, type ICalendarEvent } from '@typedec/Calendar'
import CalendarComponent from './components/Calendar'
import Sidebar from './components/Sidebar'
import ModifyCategoryModal from './modals/ModifyCategoryModal'
import ModifyEventModal from './modals/ModifyEventModal'

function CalendarModule(): React.ReactElement {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [rawEvents, refreshRawEvents, setRawEvents] = useFetch<
    ICalendarEvent[]
  >('calendar/event/list')
  const [categories, refreshCategories] = useFetch<ICalendarCategory[]>(
    'calendar/category/list'
  )
  const [events, setEvents] = useState<ICalendarEvent[]>([])
  const [modifyEventModalOpenType, setModifyEventModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
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
        <ModuleHeader
          title="Calendar"
          desc="Make sure you don't miss important event."
        />
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
          />
          <div className="flex size-full flex-col xl:ml-8">
            <div className="mb-8 size-full">
              <CalendarComponent
                events={events}
                setRawEvents={setRawEvents}
                categories={categories}
                setModifyEventModalOpenType={setModifyEventModalOpenType}
                setExistedData={setExistedData}
                refreshRawEvents={refreshRawEvents}
              />
            </div>
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
    </>
  )
}

export default CalendarModule
