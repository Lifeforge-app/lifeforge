import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import Markdown from 'react-markdown'
import { Link } from 'react-router'

import { Button, HamburgerMenu, MenuItem } from '@lifeforge/ui'

import { INTERNAL_CATEGORIES } from '@apps/Calendar/constants/internalCategories'
import {
  ICalendarCategory,
  ICalendarEvent
} from '@apps/Calendar/interfaces/calendar_interfaces'

import useComponentBg from '@hooks/useComponentBg'

function AgendaEventItem({
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
  const { componentBg } = useComponentBg()
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
    <div
      className={clsx(
        componentBg,
        'shadow-custom relative rounded-md p-4 pl-9 before:absolute before:top-4 before:left-4 before:h-[calc(100%-2rem)] before:w-1 before:rounded-full before:bg-[var(--bg-color)]'
      )}
      style={{
        // @ts-expect-error - CSS variable
        '--bg-color': category?.color ?? ''
      }}
    >
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
  )
}

export default AgendaEventItem
