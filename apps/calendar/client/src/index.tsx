import forgeAPI from '@/utils/forgeAPI'
import { useQuery } from '@tanstack/react-query'
import {
  ContentWrapperWithSidebar,
  ContextMenu,
  ContextMenuItem,
  FAB,
  LayoutWithSidebar,
  ModuleHeader,
  Scrollbar
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { parseAsString, useQueryState } from 'nuqs'
import { useCallback, useEffect } from 'react'

import CalendarComponent from './components/Calendar'
import Sidebar from './components/Sidebar'
import ModifyEventModal from './components/modals/ModifyEventModal'
import ScanImageModal from './components/modals/ScanImageModal'
import { useCalendarStore } from './stores/useCalendarStore'

function CalendarModule() {
  const open = useModalStore(state => state.open)

  const { start, end } = useCalendarStore()

  const rawEventsQuery = useQuery(
    forgeAPI.calendar.events.getByDateRange
      .input({
        start,
        end
      })
      .queryOptions()
  )

  const [selectedCategory, setSelectedCategory] = useQueryState(
    'category',
    parseAsString.withDefault('')
  )

  const [selectedCalendar, setSelectedCalendar] = useQueryState(
    'calendar',
    parseAsString.withDefault('')
  )

  const handleScanImageModalOpen = useCallback(() => {
    open(ScanImageModal, {})
  }, [])

  const handleCreateEvent = useCallback(() => {
    open(ModifyEventModal, {
      type: 'create'
    })
  }, [])

  useEffect(() => {
    useCalendarStore
      .getState()
      .setIsEventLoading(rawEventsQuery.isFetching || rawEventsQuery.isLoading)
  }, [rawEventsQuery.isFetching, rawEventsQuery.isLoading])

  return (
    <>
      <ModuleHeader />
      <LayoutWithSidebar>
        <Sidebar
          selectedCalendar={selectedCalendar}
          selectedCategory={selectedCategory}
          setSelectedCalendar={setSelectedCalendar}
          setSelectedCategory={setSelectedCategory}
        />
        <ContentWrapperWithSidebar>
          <Scrollbar>
            <div className="size-full pr-4 pb-8">
              <CalendarComponent
                events={rawEventsQuery.data ?? []}
                selectedCalendar={selectedCalendar}
                selectedCategory={selectedCategory}
              />
            </div>
          </Scrollbar>
        </ContentWrapperWithSidebar>
      </LayoutWithSidebar>
      <ContextMenu
        buttonComponent={<FAB className="static!" visibilityBreakpoint="md" />}
        classNames={{
          wrapper: 'fixed right-6 bottom-6'
        }}
      >
        <ContextMenuItem
          icon="tabler:photo"
          label="Scan from Image"
          namespace="apps.calendar"
          onClick={handleScanImageModalOpen}
        />
        <ContextMenuItem
          icon="tabler:plus"
          label="Input Manually"
          namespace="apps.calendar"
          onClick={handleCreateEvent}
        />
      </ContextMenu>
    </>
  )
}

export default CalendarModule
