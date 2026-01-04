import type { AchievementCategory } from '@'
import forgeAPI from '@/utils/forgeAPI'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormModal, defineForm } from 'lifeforge-ui'
import type { InferInput } from 'shared'

function ModifyCategoriesModal({
  onClose,
  data: { modifyType, initialData }
}: {
  onClose: () => void
  data: {
    modifyType: 'create' | 'update'
    initialData?: AchievementCategory
  }
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (modifyType === 'create'
      ? forgeAPI.achievements.categories.create
      : forgeAPI.achievements.categories.update.input({
          id: initialData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['achievements', 'categories']
        })
      }
    })
  )

  const { formProps } = defineForm<
    InferInput<
      (typeof forgeAPI.achievements.categories)[typeof modifyType]
    >['body']
  >({
    icon: modifyType === 'create' ? 'tabler:plus' : 'tabler:pencil',
    title: `achievement.category.${modifyType}`,
    onClose,
    namespace: 'apps.achievements',
    submitButton: modifyType
  })
    .typesMap({
      name: 'text',
      color: 'color',
      icon: 'icon'
    })
    .setupFields({
      name: {
        required: true,
        label: 'Category name',
        icon: 'tabler:category',
        placeholder: 'My category'
      },
      color: {
        required: true,
        label: 'Category color'
      },
      icon: {
        required: true,
        label: 'Category icon'
      }
    })
    .autoFocusField('name')
    .initialData(initialData || {})
    .onSubmit(async formData => {
      await mutation.mutateAsync(formData)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyCategoriesModal
