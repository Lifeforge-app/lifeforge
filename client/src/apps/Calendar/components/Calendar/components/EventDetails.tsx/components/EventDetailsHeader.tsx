import { Icon } from '@iconify/react'
import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { DeleteConfirmationModal, HamburgerMenu, MenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { toast } from 'react-toastify'

import ModifyEventModal from '@apps/Calendar/components/modals/ModifyEventModal'
import {
  ICalendarCategory,
  ICalendarEvent
} from '@apps/Calendar/interfaces/calendar_interfaces'
import { useCalendarStore } from '@apps/Calendar/stores/useCalendarStore'

import fetchAPI from '@utils/fetchAPI'

function EventDetailsHeader({
  event,
  category,
  editable = true
}: {
  event: ICalendarEvent
  category: ICalendarCategory | undefined
  editable?: boolean
}) {
  const open = useModalStore(state => state.open)
  const queryClient = useQueryClient()
  const { eventQueryKey } = useCalendarStore()

  const handleAddException = useCallback(async () => {
    try {
      await fetchAPI(`/calendar/events/exception/${event.id.split('-')[0]}`, {
        method: 'POST',
        body: {
          date: event.start
        }
      })

      queryClient.setQueryData(eventQueryKey, (oldData: ICalendarEvent[]) => {
        return oldData.filter(item => item.id !== event.id)
      })
    } catch (error) {
      toast.error('Failed to add exception')
      console.error('Error adding exception:', error)
    }
  }, [event.id])

  const handleEdit = useCallback(() => {
    open(ModifyEventModal, {
      existedData: event,
      type: 'update'
    })
  }, [event])

  const handleDelete = useCallback(() => {
    open(DeleteConfirmationModal, {
      apiEndpoint: 'calendar/events',
      confirmationText: 'Delete this event',
      data: { ...event, id: event.id.split('-')[0] ?? '' },
      itemName: 'event',
      nameKey: 'title',
      queryKey: eventQueryKey,
      queryUpdateType: 'invalidate'
    })
  }, [event])

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
      {!event.category.startsWith('_') && editable && (
        <HamburgerMenu
          classNames={{
            button: 'dark:hover:bg-bg-700/50! p-2!'
          }}
        >
          {event.type === 'recurring' && (
            <MenuItem
              icon="tabler:calendar-off"
              text="Except Today"
              onClick={handleAddException}
            />
          )}
          <MenuItem icon="tabler:pencil" text="Edit" onClick={handleEdit} />
          <MenuItem
            isRed
            icon="tabler:trash"
            text="Delete"
            onClick={handleDelete}
          />
        </HamburgerMenu>
      )}
    </header>
  )
}

export default EventDetailsHeader
