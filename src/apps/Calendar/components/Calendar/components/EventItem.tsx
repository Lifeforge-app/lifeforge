import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import { useMemo } from 'react'
import { Tooltip } from 'react-tooltip'

import { INTERNAL_CATEGORIES } from '@apps/Calendar/constants/internalCategories'

import {
  type ICalendarCategory,
  type ICalendarEvent
} from '../../../interfaces/calendar_interfaces'
import EventDetails from './EventDetails.tsx/index.tsx'

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
  const category = useMemo<ICalendarCategory | undefined>(() => {
    if (event.category.startsWith('_')) {
      return (INTERNAL_CATEGORIES[
        event.category as keyof typeof INTERNAL_CATEGORIES
      ] ?? {}) as ICalendarCategory
    }

    return categories.find(category => category.id === event.category)
  }, [categories, event.category])

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
          <EventDetails
            category={category}
            event={event}
            setExistedData={setExistedData}
            setIsDeleteEventConfirmationModalOpen={
              setIsDeleteEventConfirmationModalOpen
            }
            setModifyEventModalOpenType={setModifyEventModalOpenType}
          />
        </div>
      </Tooltip>
    </>
  )
}
