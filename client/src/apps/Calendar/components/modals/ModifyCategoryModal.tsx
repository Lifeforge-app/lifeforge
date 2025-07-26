import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import type { InferInput } from 'lifeforge-api'
import { defineForm } from 'lifeforge-ui'

import type { CalendarCalendar } from '../Calendar'

function ModifyCategoryModal({
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
      ? forgeAPI.calendar.categories.create
      : forgeAPI.calendar.categories.update.input({
          id: initialData?.id ?? ''
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

  const Form = defineForm<
    InferInput<(typeof forgeAPI.calendar.categories)[typeof type]>['body']
  >()
    .ui({
      icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
      title: `category.${type}`,
      onClose,
      namespace: 'apps.calendar',
      submitButton: type
    })
    .typesMap({
      name: 'text',
      icon: 'icon',
      color: 'color'
    })
    .setupFields({
      name: {
        required: true,
        label: 'Category name',
        icon: 'tabler:category',
        placeholder: 'Category name'
      },
      icon: {
        required: true,
        label: 'Category icon'
      },
      color: {
        required: true,
        label: 'Category color'
      }
    })
    .initialData(initialData)
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })

  return <Form />
}

export default ModifyCategoryModal
