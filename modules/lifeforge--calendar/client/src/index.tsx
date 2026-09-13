import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'

import {
  Box,
  ContentWrapperWithSidebar,
  ContextMenu,
  ContextMenuItem,
  FAB,
  LayoutWithSidebar,
  ModuleHeader,
  Scrollbar,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import CalendarComponent from './components/Calendar'
import Sidebar from './components/Sidebar'
import ModifyEventModal from './components/modals/ModifyEventModal'
import ScanImageModal from './components/modals/ScanImageModal'
import { useCalendarStore } from './hooks/useCalendarStore'
import useFilter from './hooks/useFilter'
import './index.css'

function CalendarModule() {
  const { open } = useModalStore()
  const { start, end, category, calendar, updateFilter } = useFilter()

  const rawEventsQuery = useQuery(
    forgeAPI.events.getByDateRange
      .input({
        start,
        end
      })
      .queryOptions()
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
          selectedCalendar={calendar || null}
          selectedCategory={category || null}
          setSelectedCalendar={value => updateFilter('calendar', value ?? '')}
          setSelectedCategory={value => updateFilter('category', value ?? '')}
        />
        <ContentWrapperWithSidebar>
          <Scrollbar>
            <Box height="100%" pb="xl" pr="md" width="100%">
              <CalendarComponent
                events={rawEventsQuery.data ?? []}
                selectedCalendar={calendar}
                selectedCategory={category}
              />
            </Box>
          </Scrollbar>
        </ContentWrapperWithSidebar>
      </LayoutWithSidebar>
      <ContextMenu
        buttonComponent={<FAB position="static" visibilityBreakpoint="md" />}
        style={{
          position: 'fixed',
          bottom: '1.5em',
          right: '1.5em'
        }}
      >
        <ContextMenuItem
          icon="tabler:photo"
          label="Scan from Image"
          onClick={handleScanImageModalOpen}
        />
        <ContextMenuItem
          icon="tabler:plus"
          label="Input Manually"
          onClick={handleCreateEvent}
        />
      </ContextMenu>
    </>
  )
}

export default CalendarModule
