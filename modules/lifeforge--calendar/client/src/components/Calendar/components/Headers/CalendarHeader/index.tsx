import { memo, useCallback } from 'react'
import { type NavigateAction, type View } from 'react-big-calendar'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  Flex,
  useModalStore,
  useModuleSidebarState
} from '@lifeforge/ui'

import ModifyEventModal from '@/components/modals/ModifyEventModal'
import ScanImageModal from '@/components/modals/ScanImageModal'

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
  const { open } = useModalStore()
  const { t } = useModuleTranslation()
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
      <Flex
        align="end"
        gap="sm"
        justify="between"
        mb="md"
        minWidth="0"
        width="100%"
      >
        <NavigationControl label={label} onNavigate={onNavigate} />
        <Flex display={{ base: 'none', md: 'flex' }} gap="sm">
          <Button
            icon="tabler:calendar-pin"
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
              onClick={handleScanImageModalOpen}
            />
            <ContextMenuItem
              icon="tabler:plus"
              label="Input Manually"
              onClick={handleCreateEvent}
            />
          </ContextMenu>
        </Flex>
        <Button
          display={{ base: 'flex', xl: 'none' }}
          icon="tabler:menu"
          variant="plain"
          onClick={() => {
            setIsSidebarOpen(true)
          }}
        />
      </Flex>
      <ViewSelector currentView={currentView} onView={onView} />
    </>
  )
}

export default memo(CalendarHeader)
