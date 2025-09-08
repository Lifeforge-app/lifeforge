import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { FormModal, defineForm } from 'lifeforge-ui'
import type { InferInput } from 'shared'

import type { CalendarCalendar } from '../Calendar'

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
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.calendar.calendars.create
      : forgeAPI.calendar.calendars.update.input({ id: initialData?.id || '' })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: forgeAPI.calendar.calendars.list.key
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
    submitButton: type
  })
    .typesMap({
      name: 'text',
      color: 'color'
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
      }
    })
    .initialData(initialData)
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyCalendarModal
