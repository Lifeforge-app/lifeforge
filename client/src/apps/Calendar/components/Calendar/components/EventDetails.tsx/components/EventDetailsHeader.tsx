import { Icon } from '@iconify/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { ConfirmationModal, ContextMenu, ContextMenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import ModifyEventModal from '@apps/Calendar/components/modals/ModifyEventModal'
import { useCalendarStore } from '@apps/Calendar/stores/useCalendarStore'

import type { CalendarCategory, CalendarEvent } from '../../..'

function EventDetailsHeader({
  event,
  category,
  editable = true
}: {
  event: CalendarEvent
  category: CalendarCategory | undefined
  editable?: boolean
}) {
  const { t } = useTranslation('apps.calendar')

  const open = useModalStore(state => state.open)

  const queryClient = useQueryClient()

  const { start, end } = useCalendarStore()

  const addExceptionMutation = useMutation(
    forgeAPI.calendar.events.addException
      .input({
        id: event.id.split('-')[0] ?? '',
        date: dayjs(event.start).toISOString()
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.setQueryData(
            forgeAPI.calendar.events.getByDateRange.input({ start, end }).key,
            (oldData: CalendarEvent[]) => {
              return oldData.filter(item => item.id !== event.id)
            }
          )
        }
      })
  )

  const handleAddException = useCallback(async () => {
    open(ConfirmationModal, {
      title: t('modals.confirmAddException.title'),
      description: t('modals.confirmAddException.description'),
      onConfirm: async () => {
        await addExceptionMutation.mutateAsync({})
      }
    })
  }, [event.id])

  const handleEdit = useCallback(() => {
    open(ModifyEventModal, {
      initialData: event,
      type: 'update'
    })
  }, [event])

  const deleteMutation = useMutation(
    forgeAPI.calendar.events.remove
      .input({
        id: event.id.split('-')[0] ?? ''
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['calendar'] })
        },
        onError: () => {
          toast.error(
            'An error occurred while deleting the event. Please try again later.'
          )
        }
      })
  )

  const handleDelete = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Event',
      description: 'Are you sure you want to delete this event?',
      buttonType: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
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
        <ContextMenu
          classNames={{
            button: 'dark:hover:bg-bg-700/50! p-2!'
          }}
        >
          <ContextMenuItem
            icon="tabler:pencil"
            label="Edit"
            onClick={handleEdit}
          />
          {event.type === 'recurring' ? (
            <ContextMenuItem
              dangerous
              icon="tabler:calendar-off"
              namespace="apps.calendar"
              label="Except This Time"
              onClick={handleAddException}
            />
          ) : (
            <ContextMenuItem
              dangerous
              icon="tabler:trash"
              label="Delete"
              onClick={handleDelete}
            />
          )}
        </ContextMenu>
      )}
    </header>
  )
}

export default EventDetailsHeader
