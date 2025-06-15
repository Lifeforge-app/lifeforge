import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { memo, useCallback } from 'react'
import { type NavigateAction, type View } from 'react-big-calendar'
import { useTranslation } from 'react-i18next'

import { Button, MenuItem } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import NavigationControl from './components/NavigationControl'
import ViewSelector from './components/ViewSelector'

interface CalendarHeaderProps {
  label: string
  view: View
  setSidebarOpen: (value: boolean) => void
  onNavigate: (direction: NavigateAction) => void
  onView: (view: View) => void
}

function CalendarHeader({
  label,
  view: currentView,
  setSidebarOpen,
  onNavigate,
  onView
}: CalendarHeaderProps) {
  const open = useModalStore(state => state.open)
  const { t } = useTranslation('apps.calendar')

  const handleScanImageModalOpen = useCallback(() => {
    open('calendar.scanImage', {})
  }, [])

  const handleCreateEvent = useCallback(() => {
    open('calendar.modifyEvent', {
      existedData: null,
      type: 'create'
    })
  }, [])

  const handleNavigateToday = useCallback(() => {
    onNavigate('TODAY')
  }, [])

  return (
    <>
      <div className="mb-4 flex w-full items-end justify-between gap-3">
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
          <Menu as="div" className="relative z-50">
            <Button
              as={MenuButton}
              icon="tabler:plus"
              tProps={{ item: t('items.event') }}
              onClick={() => {}}
            >
              new
            </Button>
            <MenuItems
              transition
              anchor="bottom end"
              className="bg-bg-100 dark:bg-bg-800 mt-2 overflow-hidden overscroll-contain rounded-md shadow-lg outline-hidden transition duration-100 ease-out focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
            >
              <MenuItem
                icon="tabler:photo"
                namespace="apps.calendar"
                text="Scan from Image"
                onClick={handleScanImageModalOpen}
              />
              <MenuItem
                icon="tabler:plus"
                namespace="apps.calendar"
                text="Input Manually"
                onClick={handleCreateEvent}
              />
            </MenuItems>
          </Menu>
        </div>
        <Button
          className="xl:hidden"
          icon="tabler:menu"
          variant="plain"
          onClick={() => {
            setSidebarOpen(true)
          }}
        />
      </div>
      <ViewSelector currentView={currentView} onView={onView} />
    </>
  )
}

export default memo(CalendarHeader)
