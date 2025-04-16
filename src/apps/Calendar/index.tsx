import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import dayjs from 'dayjs'
import { useCallback, useMemo, useState } from 'react'

import {
  ContentWrapperWithSidebar,
  DeleteConfirmationModal,
  FAB,
  LayoutWithSidebar,
  MenuItem,
  ModuleHeader,
  ModuleWrapper,
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
import ScanImageModal from './modals/ScanImageModal'

function CalendarModule() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const categoriesQuery = useAPIQuery<ICalendarCategory[]>(
    'calendar/categories',
    ['calendar', 'categories']
  )
  const [scanImageModalOpen, setScanImageModalOpen] = useState(false)
  const [modifyEventModalOpenType, setModifyEventModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [
    deleteCategoryConfirmationModalOpen,
    setDeleteCategoryConfirmationModalOpen
  ] = useState(false)
  const [
    isDeleteEventConfirmationModalOpen,
    setIsDeleteEventConfirmationModalOpen
  ] = useState(false)
  const [existedData, setExistedData] =
    useState<Partial<ICalendarEvent> | null>(null)
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

  const events = useMemo(() => {
    if (rawEventsQuery.data) {
      return rawEventsQuery.data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      }))
    } else {
      return []
    }
  }, [rawEventsQuery.data])

  const refetchEvents = useCallback(
    (
      range:
        | Date[]
        | {
            start: Date
            end: Date
          }
    ) => {
      if (Array.isArray(range)) {
        setStart(dayjs(range[0]).format('YYYY-MM-DD'))
        setEnd(dayjs(range[range.length - 1]).format('YYYY-MM-DD'))
        return
      }

      if (range.start && range.end) {
        setStart(dayjs(range.start).format('YYYY-MM-DD'))
        setEnd(dayjs(range.end).format('YYYY-MM-DD'))
      }
    },
    []
  )

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
              <div className="size-full pr-4 pb-8">
                <CalendarComponent
                  categories={categoriesQuery?.data ?? []}
                  events={events}
                  queryKey={eventQueryKey}
                  refetchEvents={refetchEvents}
                  setExistedData={setExistedData}
                  setIsDeleteEventConfirmationModalOpen={
                    setIsDeleteEventConfirmationModalOpen
                  }
                  setModifyEventModalOpenType={setModifyEventModalOpenType}
                  setScanImageModalOpen={setScanImageModalOpen}
                />
              </div>
            </Scrollbar>
          </ContentWrapperWithSidebar>
        </LayoutWithSidebar>
        <Menu as="div" className="relative z-[9991]">
          <FAB as={MenuButton} hideWhen="lg" />
          <MenuItems
            transition
            anchor="bottom end"
            className="bg-bg-100 dark:bg-bg-800 w-48 overflow-hidden overscroll-contain rounded-md shadow-lg outline-hidden transition duration-100 ease-out [--anchor-gap:8px] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
          >
            <MenuItem
              icon="tabler:photo"
              namespace="apps.calendar"
              text="Scan from Image"
              onClick={() => {
                setScanImageModalOpen(true)
              }}
            />
            <MenuItem
              icon="tabler:plus"
              namespace="apps.calendar"
              text="Input Manually"
              onClick={() => {
                setModifyEventModalOpenType('create')
                setExistedData(null)
              }}
            />
          </MenuItems>
        </Menu>
      </ModuleWrapper>
      <ScanImageModal
        open={scanImageModalOpen}
        setExistedData={setExistedData}
        setModifyModalOpenType={setModifyEventModalOpenType}
        setOpen={setScanImageModalOpen}
      />
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
      <DeleteConfirmationModal
        apiEndpoint="calendar/events"
        data={
          { ...existedData, id: existedData?.id?.split('-')[0] ?? '' } as any
        }
        isOpen={isDeleteEventConfirmationModalOpen}
        itemName="event"
        nameKey="title"
        queryKey={eventQueryKey}
        queryUpdateType="invalidate"
        onClose={() => {
          setIsDeleteEventConfirmationModalOpen(false)
          setExistedData(null)
          categoriesQuery.refetch()
        }}
      />
    </>
  )
}

export default CalendarModule
