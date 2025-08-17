import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  ContentWrapperWithSidebar,
  ContextMenu,
  ContextMenuItem,
  FAB,
  LayoutWithSidebar,
  ModuleHeader,
  ModuleWrapper,
  Scrollbar
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useState } from 'react'

import CalendarComponent from './components/Calendar'
import Sidebar from './components/Sidebar'
import ModifyEventModal from './components/modals/ModifyEventModal'
import ScanImageModal from './components/modals/ScanImageModal'
import { useCalendarStore } from './stores/useCalendarStore'

function CalendarModule() {
  const open = useModalStore(state => state.open)

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { start, end } = useCalendarStore()

  const rawEventsQuery = useQuery(
    forgeAPI.calendar.events.getByDateRange
      .input({
        start,
        end
      })
      .queryOptions()
  )

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  )

  const [selectedCalendar, setSelectedCalendar] = useState<string | undefined>(
    undefined
  )

  const handleScanImageModalOpen = useCallback(() => {
    open(ScanImageModal, {})
  }, [])

  const handleCreateEvent = useCallback(() => {
    open(ModifyEventModal, {
      type: 'create'
    })
  }, [])

  return (
    <>
      <ModuleWrapper>
        <ModuleHeader icon="tabler:calendar" title="Calendar" />
        <LayoutWithSidebar>
          <Sidebar
            selectedCalendar={selectedCalendar}
            selectedCategory={selectedCategory}
            setSelectedCalendar={setSelectedCalendar}
            setSelectedCategory={setSelectedCategory}
            setSidebarOpen={setSidebarOpen}
            sidebarOpen={sidebarOpen}
          />
          <ContentWrapperWithSidebar>
            <Scrollbar>
              <div className="size-full pr-4 pb-8">
                <CalendarComponent
                  events={rawEventsQuery.data ?? []}
                  selectedCalendar={selectedCalendar}
                  selectedCategory={selectedCategory}
                  setSidebarOpen={setSidebarOpen}
                />
              </div>
            </Scrollbar>
          </ContentWrapperWithSidebar>
        </LayoutWithSidebar>
        <ContextMenu
          buttonComponent={
            <FAB className="static!" visibilityBreakpoint="md" />
          }
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
      </ModuleWrapper>
    </>
  )
}

export default CalendarModule
