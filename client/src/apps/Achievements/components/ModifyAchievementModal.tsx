import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { FormModal, defineForm } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import type { InferInput } from 'shared'
import COLOR from 'tailwindcss/colors'

import type { Achievement } from '..'

const difficulties = [
  ['easy', 'green'],
  ['medium', 'yellow'],
  ['hard', 'red'],
  ['impossible', 'purple']
]

function ModifyAchievementModal({
  data: { modifyType, initialData, currentDifficulty },
  onClose
}: {
  data: {
    modifyType: 'create' | 'update'
    initialData?: Achievement
    currentDifficulty: Achievement['difficulty']
  }
  onClose: () => void
}) {
  const { t } = useTranslation('apps.achievements')

  const queryClient = useQueryClient()

  const mutation = useMutation(
    (modifyType === 'create'
      ? forgeAPI.achievements.entries.create
      : forgeAPI.achievements.entries.update.input({
          id: initialData?.id || '' || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['achievements']
        })
      }
    })
  )

  const formProps = defineForm<
    InferInput<
      (typeof forgeAPI.achievements.entries)[typeof modifyType]
    >['body']
  >({
    icon: modifyType === 'create' ? 'tabler:plus' : 'tabler:pencil',
    title: `achievement.${modifyType}`,
    onClose,
    namespace: 'apps.achievements',
    submitButton: modifyType
  })
    .typesMap({
      difficulty: 'listbox',
      title: 'text',
      thoughts: 'textarea'
    })
    .setupFields({
      title: {
        required: true,
        label: 'Achievement title',
        icon: 'tabler:award',
        placeholder: 'My achievement'
      },
      thoughts: {
        required: true,
        label: 'Achievement thoughts',
        icon: 'tabler:bubble-text',
        placeholder: 'My thoughts'
      },
      difficulty: {
        required: true,
        multiple: false,
        label: 'Achievement difficulty',
        icon: 'tabler:list',
        options: difficulties.map(([name, color]) => ({
          text: t(`difficulties.${name}`),
          value: name as Achievement['difficulty'],
          color: COLOR[color as keyof typeof COLOR][500]
        }))
      }
    })
    .initialData({
      title: initialData?.title || '',
      thoughts: initialData?.thoughts || '',
      difficulty: initialData?.difficulty || currentDifficulty || 'easy'
    })
    .onSubmit(async formData => {
      await mutation.mutateAsync(formData)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyAchievementModal
