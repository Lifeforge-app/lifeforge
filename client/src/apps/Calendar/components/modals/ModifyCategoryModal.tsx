import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import type { InferInput } from 'lifeforge-api'
import { type FormFieldConfig, FormModal } from 'lifeforge-ui'

import type { CalendarCalendar } from '../Calendar'

function ModifyCategoryModal({
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
      ? forgeAPI.calendar.categories.create
      : forgeAPI.calendar.categories.update.input({
          id: existedData?.id ?? ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: forgeAPI.calendar.categories.list.key
        })
        onClose()
      }
    })
  )

  const FIELDS = {
    name: {
      required: true,
      label: 'Category name',
      icon: 'tabler:category',
      placeholder: 'Category name',
      type: 'text'
    },
    icon: {
      required: true,
      label: 'Category icon',
      type: 'icon'
    },
    color: {
      required: true,
      label: 'Category color',
      type: 'color'
    }
  } as const satisfies FormFieldConfig<
    InferInput<(typeof forgeAPI.calendar.categories)[typeof type]>['body']
  >

  async function onSubmit(
    data: InferInput<(typeof forgeAPI.calendar.categories)[typeof type]>['body']
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
        icon: {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[type],
        title: `category.${type}`,
        namespace: 'apps.calendar',
        onClose
      }}
    />
  )
}

export default ModifyCategoryModal
