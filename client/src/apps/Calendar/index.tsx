import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  ContentWrapperWithSidebar,
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
        <Menu as="div" className="relative z-[9991]">
          <FAB as={MenuButton} hideWhen="md" />
          <MenuItems
            transition
            anchor="bottom end"
            className="bg-bg-100 dark:bg-bg-800 overflow-hidden overscroll-contain rounded-md shadow-lg outline-hidden transition duration-100 ease-out [--anchor-gap:8px] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
          >
            <ContextMenuItem
              icon="tabler:photo"
              namespace="apps.calendar"
              text="Scan from Image"
              onClick={handleScanImageModalOpen}
            />
            <ContextMenuItem
              icon="tabler:plus"
              namespace="apps.calendar"
              text="Input Manually"
              onClick={handleCreateEvent}
            />
          </MenuItems>
        </Menu>
      </ModuleWrapper>
    </>
  )
}

export default CalendarModule
