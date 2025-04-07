import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import Markdown from 'react-markdown'
import { Link } from 'react-router'
import { Tooltip } from 'react-tooltip'

import { Button, HamburgerMenu, MenuItem } from '@lifeforge/ui'

import { INTERNAL_CATEGORIES } from '@apps/Calendar/constants/internalCategories'

import {
  type ICalendarCategory,
  type ICalendarEvent
} from '../../../interfaces/calendar_interfaces'

export default function EventItem({
  event,
  categories,
  setModifyEventModalOpenType,
  setExistedData,
  setIsDeleteEventConfirmationModalOpen
}: {
  event: ICalendarEvent
  categories: ICalendarCategory[]
  setModifyEventModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: React.Dispatch<React.SetStateAction<ICalendarEvent | null>>
  setIsDeleteEventConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
}) {
  const eventIsWholeDay = useMemo(() => {
    return (
      dayjs(event.start).format('HH:mm') === '00:00' &&
      dayjs(event.end).format('HH:mm') === '00:00' &&
      dayjs(event.end).diff(dayjs(event.start), 'day') === 1
    )
  }, [event.start, event.end])

  const category = useMemo(() => {
    if (event.category.startsWith('_')) {
      return (
        INTERNAL_CATEGORIES[
          event.category as keyof typeof INTERNAL_CATEGORIES
        ] ?? {}
      )
    }

    return categories.find(category => category.id === event.category)
  }, [categories, event.category])

  const eventTime = useMemo(() => {
    if (eventIsWholeDay) {
      return 'All Day'
    }

    return dayjs(event.end).diff(dayjs(event.start), 'day') > 1
      ? `${dayjs(event.start).format('YYYY-MM-DD h:mm A')} - ${dayjs(event.end).format('YYYY-MM-DD h:mm A')}`
      : `${dayjs(event.start).format('h:mm A')} - ${dayjs(event.end).format('h:mm A')}`
  }, [event.start, event.end, eventIsWholeDay])

  return (
    <>
      <button
        className="flex w-full flex-row! flex-nowrap! items-start rounded-md px-[5px] py-[2px]"
        data-tooltip-id={`calendar-event-${event.id}`}
        style={{
          backgroundColor: category?.color + '33'
        }}
      >
        <div className="flex w-full min-w-0 items-center gap-2">
          {typeof categories !== 'string' && event.category !== '' && (
            <Icon
              className="size-4 shrink-0"
              icon={category?.icon ?? ''}
              style={{
                color: category?.color
              }}
            />
          )}
          <span
            className={clsx(
              'w-full min-w-0 truncate text-left',
              event.is_strikethrough && 'line-through decoration-2'
            )}
          >
            {event.title}
          </span>
        </div>
      </button>
      <Tooltip
        clickable
        noArrow
        openOnClick
        className="bg-bg-50! text-bg-800! border-bg-200 dark:border-bg-700 shadow-custom dark:bg-bg-800! bg-opacity-0! dark:text-bg-50 z-[9999]! rounded-md! border p-4! text-base!"
        id={`calendar-event-${event.id}`}
        opacity={1}
        place="bottom-end"
        positionStrategy="fixed"
      >
        <div className="relative max-h-96 max-w-96 min-w-64 overflow-y-auto whitespace-normal">
          <div className="flex items-start justify-between gap-8">
            <div>
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
                <MenuItem
                  icon="tabler:pencil"
                  text="Edit"
                  onClick={() => {
                    setExistedData(event)
                    setModifyEventModalOpenType('update')
                  }}
                />
                {!event.cannot_delete && (
                  <MenuItem
                    isRed
                    icon="tabler:trash"
                    text="Delete"
                    onClick={() => {
                      setExistedData(event)
                      setIsDeleteEventConfirmationModalOpen(true)
                    }}
                  />
                )}
              </HamburgerMenu>
            )}
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <Icon
                className="text-bg-500 size-4 shrink-0"
                icon="tabler:clock-hour-3"
              />
              <span className="text-bg-500">{eventTime}</span>
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
            {event.description && (
              <div className="prose max-w-auto! mt-8 w-full">
                <Markdown>{event.description}</Markdown>
              </div>
            )}
          </div>
          {event.reference_link && (
            <Button
              as={Link}
              className="mt-6 w-full"
              icon="tabler:link"
              rel="noopener noreferrer"
              target={
                event.reference_link.startsWith('http') ? '_blank' : undefined
              }
              to={event.reference_link}
              variant="secondary"
            >
              View Reference
            </Button>
          )}
        </div>
      </Tooltip>
    </>
  )
}
