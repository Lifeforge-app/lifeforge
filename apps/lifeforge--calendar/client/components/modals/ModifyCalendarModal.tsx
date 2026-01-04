import forgeAPI from '@/utils/forgeAPI'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormModal, defineForm, useModalStore } from 'lifeforge-ui'
import type { InferInput } from 'shared'

import type { CalendarCalendar } from '../Calendar'
import SubscribeICSModal from './SubscribeICSModal'

function ModifyCalendarModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: CalendarCalendar
  }
  onClose: () => void
}) {
  const open = useModalStore(state => state.open)

  const queryClient = useQueryClient()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.calendar.calendars.create
      : forgeAPI.calendar.calendars.update.input({
          id: initialData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: forgeAPI.calendar.calendars.list.key
        })
        queryClient.invalidateQueries({
          queryKey: ['calendar', 'events']
        })
        onClose()
      }
    })
  )

  const { formProps } = defineForm<
    InferInput<(typeof forgeAPI.calendar.calendars)[typeof type]>['body']
  >({
    icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
    title: `calendar.${type}`,
    onClose,
    namespace: 'apps.calendar',
    submitButton: type,
    actionButton:
      type !== 'update'
        ? {
            type: 'plain',
            icon: 'tabler:calendar-code',
            onClick: (_, setData) =>
              open(SubscribeICSModal, {
                onSubmit: icsUrl => {
                  setData(state => ({
                    ...state,
                    icsUrl
                  }))
                }
              })
          }
        : undefined
  })
    .typesMap({
      name: 'text',
      color: 'color',
      icsUrl: 'text'
    })
    .setupFields({
      name: {
        required: true,
        label: 'Calendar name',
        icon: 'tabler:calendar',
        placeholder: 'Calendar name'
      },
      color: {
        required: true,
        label: 'Calendar color'
      },
      icsUrl: {
        required: false,
        label: 'ICS URL',
        icon: 'tabler:link',
        placeholder: 'https://example.com/calendar.ics',
        disabled: true
      }
    })
    .conditionalFields({
      icsUrl: formState => !!formState.icsUrl
    })
    .initialData(initialData)
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyCalendarModal
