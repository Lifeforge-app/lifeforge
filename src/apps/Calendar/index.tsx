import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'

import {
  ContentWrapperWithSidebar,
  DeleteConfirmationModal,
  LayoutWithSidebar,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper,
  Scrollbar
} from '@lifeforge/ui'

import useAPIQuery from '@hooks/useAPIQuery'

import CalendarComponent from './components/Calendar'
import Sidebar from './components/Sidebar'
import {
  type ICalendarCategory,
  type ICalendarEvent
} from './interfaces/calendar_interfaces'
import ModifyCategoryModal from './modals/ModifyCategoryModal'
import ModifyEventModal from './modals/ModifyEventModal'

function CalendarModule() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const categoriesQuery = useAPIQuery<ICalendarCategory[]>(
    'calendar/categories',
    ['calendar', 'categories']
  )
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
  const [start, setStart] = useState(
    dayjs().startOf('month').format('YYYY-MM-DD')
  )
  const [end, setEnd] = useState(dayjs().endOf('month').format('YYYY-MM-DD'))
  const eventQueryKey = useMemo(
    () => ['calendar', 'events', start, end],
    [start, end]
  )
  const rawEventsQuery = useAPIQuery<ICalendarEvent[]>(
    `calendar/events?start=${start}&end=${end}`,
    eventQueryKey
  )

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
                      queryKey={eventQueryKey}
                      setEnd={setEnd}
                      setExistedData={setExistedData}
                      setModifyEventModalOpenType={setModifyEventModalOpenType}
                      setStart={setStart}
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
        eventQueryKey={eventQueryKey}
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
        confirmationText="Delete this event"
        data={existedCategoryData ?? undefined}
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
