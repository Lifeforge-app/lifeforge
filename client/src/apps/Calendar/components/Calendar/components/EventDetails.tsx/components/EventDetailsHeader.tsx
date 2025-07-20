import { Icon } from '@iconify/react'
import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { DeleteConfirmationModal, HamburgerMenu, MenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import {
  CalendarCollectionsSchemas,
  ISchemaWithPB
} from 'shared/types/collections'

import UpdateEventModal from '@apps/Calendar/components/modals/ModifyEventModal/UpdateEventModal'
import { useCalendarStore } from '@apps/Calendar/stores/useCalendarStore'

import { ICalendarEvent } from '../../..'

function EventDetailsHeader({
  event,
  category,
  editable = true
}: {
  event: ICalendarEvent
  category:
    | ISchemaWithPB<CalendarCollectionsSchemas.ICategoryAggregated>
    | undefined
  editable?: boolean
}) {
  const { t } = useTranslation('apps.calendar')

  const open = useModalStore(state => state.open)

  const queryClient = useQueryClient()

  const { eventQueryKey } = useCalendarStore()

  const handleAddException = useCallback(async () => {
    open(DeleteConfirmationModal, {
      data: { id: event.id.split('-')[0] ?? '' },
      customConfirmButtonIcon: 'tabler:calendar-off',
      customTitle: t('modals.confirmAddException.title'),
      customText: t('modals.confirmAddException.description'),
      apiEndpoint: 'calendar/events/exception',
      apiQueries: {
        date: dayjs(event.start).toISOString()
      },
      async afterDelete() {
        queryClient.setQueryData(eventQueryKey, (oldData: ICalendarEvent[]) => {
          return oldData.filter(item => item.id !== event.id)
        })
      },
      customConfirmButtonText: 'proceed'
    })
  }, [event.id])

  const handleEdit = useCallback(() => {
    open(UpdateEventModal, {
      existedData: event,
      type: 'update'
    })
  }, [event])

  const handleDelete = useCallback(() => {
    open(DeleteConfirmationModal, {
      apiEndpoint: 'calendar/events',
      confirmationText: 'Delete this event',
      data: { id: event.id.split('-')[0] ?? '' },
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
          <MenuItem icon="tabler:pencil" text="Edit" onClick={handleEdit} />
          {event.type === 'recurring' ? (
            <MenuItem
              isRed
              icon="tabler:calendar-off"
              namespace="apps.calendar"
              text="Except This Time"
              onClick={handleAddException}
            />
          ) : (
            <MenuItem
              isRed
              icon="tabler:trash"
              text="Delete"
              onClick={handleDelete}
            />
          )}
        </HamburgerMenu>
      )}
    </header>
  )
}

export default EventDetailsHeader
