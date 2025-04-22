import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'

import { HamburgerMenu, MenuItem } from '@lifeforge/ui'

import {
  ICalendarCategory,
  ICalendarEvent
} from '@apps/Calendar/interfaces/calendar_interfaces'

function EventDetailsHeader({
  event,
  category,
  setModifyEventModalOpenType,
  setExistedData,
  setIsDeleteEventConfirmationModalOpen
}: {
  event: ICalendarEvent
  category: ICalendarCategory | undefined
  setModifyEventModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: React.Dispatch<React.SetStateAction<ICalendarEvent | null>>
  setIsDeleteEventConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
}) {
  const exceptToday = () => {}

  return (
    <header className="flex items-start justify-between gap-8">
      <div>
        <div className="flex items-center gap-2">
          {event.category !== '' && (
            <Icon
              className="size-4 shrink-0"
              icon={category?.icon ?? ''}
              style={{
                color: category?.color
              }}
            />
          )}
          <span className="text-bg-500 truncate">{category?.name}</span>
        </div>
        <h3
          className={clsx(
            'text-bg-800 dark:text-bg-100 mt-2 text-xl font-semibold',
            event.is_strikethrough && 'line-through decoration-2'
          )}
        >
          {event.title}
        </h3>
      </div>
      {!event.category.startsWith('_') && (
        <HamburgerMenu
          classNames={{
            button: 'dark:hover:bg-bg-700/50! p-2!'
          }}
        >
          {event.type === 'recurring' && (
            <MenuItem
              icon="tabler:calendar-off"
              text="Except Today"
              onClick={exceptToday}
            />
          )}
          <MenuItem
            icon="tabler:pencil"
            text="Edit"
            onClick={() => {
              setExistedData(event)
              setModifyEventModalOpenType('update')
            }}
          />
          <MenuItem
            isRed
            icon="tabler:trash"
            text="Delete"
            onClick={() => {
              setExistedData(event)
              setIsDeleteEventConfirmationModalOpen(true)
            }}
          />
        </HamburgerMenu>
      )}
    </header>
  )
}

export default EventDetailsHeader
