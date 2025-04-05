import { Icon } from '@iconify/react/dist/iconify.js'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { Tooltip } from 'react-tooltip'

import { HamburgerMenu, MenuItem } from '@lifeforge/ui'

import {
  type ICalendarCategory,
  type ICalendarEvent
} from '../../../interfaces/calendar_interfaces'

export default function EventItem({
  event,
  categories,
  setModifyEventModalOpenType,
  setExistedData
}: {
  event: ICalendarEvent
  categories: ICalendarCategory[]
  setModifyEventModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: React.Dispatch<React.SetStateAction<ICalendarEvent | null>>
}) {
  const eventIsWholeDay = useMemo(() => {
    return (
      dayjs(event.start).format('HH:mm') === '00:00' &&
      dayjs(event.end).format('HH:mm') === '00:00' &&
      dayjs(event.end).diff(dayjs(event.start), 'day') === 1
    )
  }, [event.start, event.end])
  const category = useMemo(() => {
    return categories.find(category => category.id === event.category)
  }, [categories, event.category])

  return (
    <>
      <button
        className="flex w-full flex-row! flex-nowrap! items-center gap-2 rounded-md px-[5px] py-[2px]"
        data-tooltip-id={`calendar-event-${event.id}`}
        style={{
          backgroundColor: category?.color + '33'
        }}
      >
        {typeof categories !== 'string' && event.category !== '' && (
          <Icon
            className="size-4 shrink-0"
            icon={category?.icon ?? ''}
            style={{
              color: category?.color
            }}
          />
        )}
        <span className="truncate">{event.title}</span>
      </button>
      <Tooltip
        clickable
        noArrow
        openOnClick
        className="bg-bg-50 text-bg-800 shadow-custom dark:bg-bg-800! bg-opacity-0! dark:text-bg-50 z-[999]! rounded-md! p-4! text-base!"
        id={`calendar-event-${event.id}`}
        opacity={1}
        place="bottom-end"
        positionStrategy="fixed"
      >
        <div className="relative max-w-96 min-w-64 whitespace-normal">
          <div className="flex items-center gap-2">
            {typeof categories !== 'string' && event.category !== '' && (
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
          <h3 className="mt-2 text-lg font-semibold">{event.title}</h3>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <Icon
                className="text-bg-500 size-4 shrink-0"
                icon="tabler:clock-hour-3"
              />
              <span className="text-bg-500">
                {eventIsWholeDay
                  ? 'All Day'
                  : dayjs(event.end).diff(dayjs(event.start), 'day') > 1
                    ? `${dayjs(event.start).format('YYYY-MM-DD h:mm A')} - ${dayjs(event.end).format('YYYY-MM-DD h:mm A')}`
                    : `${dayjs(event.start).format('h:mm A')} - ${dayjs(event.end).format('h:mm A')}`}
              </span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <Icon
                  className="text-bg-500 size-4 shrink-0"
                  icon="tabler:map-pin"
                />
                <span className="text-bg-500">{event.location}</span>
              </div>
            )}
          </div>
          <HamburgerMenu
            classNames={{
              wrapper: 'absolute top-0 right-0',
              button: 'dark:hover:bg-bg-700/50!'
            }}
          >
            <MenuItem
              icon="tabler:pencil"
              text="Edit"
              onClick={() => {
                setExistedData(event)
                setModifyEventModalOpenType('update')
              }}
            />
          </HamburgerMenu>
        </div>
      </Tooltip>
    </>
  )
}
