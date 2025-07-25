import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import type { InferInput } from 'lifeforge-api'
import { type FormFieldConfig, FormModal } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import COLOR from 'tailwindcss/colors'

import type { IAchievement } from '..'

const difficulties = [
  ['easy', 'green'],
  ['medium', 'yellow'],
  ['hard', 'red'],
  ['impossible', 'purple']
]

function ModifyAchievementModal({
  data: { type, existedData, currentDifficulty },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    existedData?: IAchievement
    currentDifficulty: IAchievement['difficulty']
  }
  onClose: () => void
}) {
  const { t } = useTranslation('apps.achievements')

  const queryClient = useQueryClient()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.achievements.entries.create
      : forgeAPI.achievements.entries.update.input({
          id: existedData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['achievements']
        })
      }
    })
  )

  const FIELDS = {
    title: {
      required: true,
      label: 'Achievement title',
      icon: 'tabler:award',
      placeholder: 'My achievement',
      type: 'text'
    },
    thoughts: {
      required: true,
      label: 'Achievement thoughts',
      icon: 'tabler:bubble-text',
      placeholder: 'My thoughts',
      type: 'textarea'
    },
    difficulty: {
      required: true,
      label: 'Achievement difficulty',
      icon: 'tabler:list',
      type: 'listbox',
      options: difficulties.map(([name, color]) => ({
        text: t(`difficulties.${name}`),
        value: name as IAchievement['difficulty'],
        color: COLOR[color as keyof typeof COLOR][500]
      }))
    }
  } as const satisfies FormFieldConfig<
    InferInput<
      (typeof forgeAPI.achievements.entries)['create' | 'update']
    >['body']
  >

  const onSubmit = useCallback(
    async (
      data: InferInput<
        (typeof forgeAPI.achievements.entries)['create' | 'update']
      >['body']
    ) => {
      await mutation.mutateAsync(data)

      onClose()
    },
    [type]
  )

  return (
    <FormModal
      form={{
        fields: FIELDS,
        existedData: {
          title: existedData?.title || '',
          thoughts: existedData?.thoughts || '',
          difficulty: existedData?.difficulty || currentDifficulty || 'easy'
        },
        onSubmit
      }}
      submitButton={type}
      ui={{
        icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
        title: `achievement.${type}`,
        onClose,
        namespace: 'apps.achievements'
      }}
    />
  )
}

export default ModifyAchievementModal
