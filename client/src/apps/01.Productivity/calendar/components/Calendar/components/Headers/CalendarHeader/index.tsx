import {
  Button,
  ContextMenu,
  ContextMenuItem,
  useModuleSidebarState
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { memo, useCallback } from 'react'
import { type NavigateAction, type View } from 'react-big-calendar'
import { useTranslation } from 'react-i18next'

import ModifyEventModal from '@apps/01.Productivity/calendar/components/modals/ModifyEventModal'
import ScanImageModal from '@apps/01.Productivity/calendar/components/modals/ScanImageModal'

import NavigationControl from './components/NavigationControl'
import ViewSelector from './components/ViewSelector'

interface CalendarHeaderProps {
  label: string
  view: View
  onNavigate: (direction: NavigateAction, date?: Date) => void
  onView: (view: View) => void
}

function CalendarHeader({
  label,
  view: currentView,
  onNavigate,
  onView
}: CalendarHeaderProps) {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.calendar')

  const { setIsSidebarOpen } = useModuleSidebarState()

  const handleScanImageModalOpen = useCallback(() => {
    open(ScanImageModal, {})
  }, [])

  const handleCreateEvent = useCallback(() => {
    open(ModifyEventModal, {
      type: 'create'
    })
  }, [])

  const handleNavigateToday = useCallback(() => {
    onNavigate('TODAY')
  }, [])

  return (
    <>
      <div className="mb-4 flex w-full min-w-0 items-end justify-between gap-3">
        <NavigationControl label={label} onNavigate={onNavigate} />
        <div className="flex hidden gap-2 md:flex">
          <Button
            className=""
            icon="tabler:calendar-pin"
            namespace="apps.calendar"
            variant="plain"
            onClick={handleNavigateToday}
          >
            today
          </Button>
          <ContextMenu
            buttonComponent={
              <Button
                icon="tabler:plus"
                tProps={{ item: t('items.event') }}
                onClick={() => {}}
              >
                new
              </Button>
            }
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
        </div>
        <Button
          className="xl:hidden"
          icon="tabler:menu"
          variant="plain"
          onClick={() => {
            setIsSidebarOpen(true)
          }}
        />
      </div>
      <ViewSelector currentView={currentView} onView={onView} />
    </>
  )
}

export default memo(CalendarHeader)
