import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import type { InferInput } from 'lifeforge-api'
import { type FormFieldConfig, FormModal } from 'lifeforge-ui'

import type { CalendarCalendar } from '../Calendar'

function ModifyCalendarModal({
  data: { type, existedData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    existedData?: CalendarCalendar
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.calendar.calendars.create
      : forgeAPI.calendar.calendars.update.input({ id: existedData!.id })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: forgeAPI.calendar.calendars.list.key
        })
        onClose()
      }
    })
  )

  const FIELDS = {
    name: {
      required: true,
      label: 'Calendar name',
      icon: 'tabler:calendar',
      placeholder: 'Calendar name',
      type: 'text'
    },
    color: {
      required: true,
      label: 'Calendar color',
      type: 'color'
    }
  } as const satisfies FormFieldConfig<
    InferInput<(typeof forgeAPI.calendar.calendars)[typeof type]>['body']
  >

  async function onSubmit(
    data: InferInput<(typeof forgeAPI.calendar.calendars)[typeof type]>['body']
  ) {
    await mutation.mutateAsync(data)
  }

  return (
    <FormModal
      form={{
        fields: FIELDS,
        existedData,
        onSubmit
      }}
      submitButton={type}
      ui={{
        title: `calendar.${type}`,
        icon: {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[type],
        namespace: 'apps.calendar',
        onClose
      }}
    />
  )
}

export default ModifyCalendarModal
