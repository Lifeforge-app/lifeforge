import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { memo } from 'react'
import { type NavigateAction, type View } from 'react-big-calendar'
import { useTranslation } from 'react-i18next'

import { Button, MenuItem } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import NavigationControl from './components/NavigationControl'
import ViewSelector from './components/ViewSelector'

interface CalendarHeaderProps {
  label: string
  view: View
  onNavigate: (direction: NavigateAction) => void
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

  const handleScanImageModalOpen = () => {
    open('calendar.scanImage', {})
  }

  const handleCreateEvent = () => {
    open('calendar.modifyEvent', {
      existedData: null,
      type: 'create'
    })
  }

  return (
    <div className="mb-4 flex w-full flex-col items-end justify-between gap-4 lg:flex-row">
      <NavigationControl label={label} onNavigate={onNavigate} />
      <div className="flex w-full gap-4 lg:w-auto">
        <ViewSelector currentView={currentView} onView={onView} />

        <Menu as="div" className="relative z-50 hidden lg:block">
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
    </div>
  )
}

export default memo(CalendarHeader)
