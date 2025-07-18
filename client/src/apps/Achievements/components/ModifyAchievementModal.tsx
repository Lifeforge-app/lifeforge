import { FormModal } from 'lifeforge-ui'
import { type IFieldProps } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import COLOR from 'tailwindcss/colors'

import {
  AchievementsCollectionsSchemas,
  ISchemaWithPB
} from 'shared/types/collections'
import { AchievementsControllersSchemas } from 'shared/types/controllers'

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
    type: 'create' | 'update' | null
    existedData: ISchemaWithPB<AchievementsCollectionsSchemas.IEntry> | null
    currentDifficulty: AchievementsCollectionsSchemas.IEntry['difficulty']
  }
  onClose: () => void
}) {
  const { t } = useTranslation('apps.achievements')

  const [formState, setFormState] = useState<
    AchievementsControllersSchemas.IEntries['createEntry']['body']
  >({
    title: '',
    thoughts: '',
    difficulty: 'easy'
  })

  const FIELDS: IFieldProps<
    AchievementsControllersSchemas.IEntries['createEntry']['body']
  >[] = [
    {
      id: 'title',
      required: true,
      label: 'Achievement title',
      icon: 'tabler:award',
      placeholder: 'My achievement',
      type: 'text'
    },
    {
      id: 'thoughts',
      required: true,
      label: 'Achievement thoughts',
      icon: 'tabler:bubble-text',
      placeholder: 'My thoughts',
      type: 'text'
    },
    {
      id: 'difficulty',
      required: true,
      label: 'Achievement difficulty',
      icon: 'tabler:list',
      type: 'listbox',
      options: difficulties.map(([name, color]) => ({
        text: t(`difficulties.${name}`),
        value: name,
        color: COLOR[color as keyof typeof COLOR][500]
      }))
    }
  ]

  useEffect(() => {
    if (type === 'update' && existedData !== null) {
      setFormState(existedData)
    } else {
      setFormState({
        title: '',
        thoughts: '',
        difficulty: currentDifficulty
      })
    }
  }, [type, existedData])

  return (
    <FormModal
      data={formState}
      endpoint="achievements/entries"
      fields={FIELDS}
      icon={
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[type!]
      }
      id={existedData?.id}
      namespace="apps.achievements"
      openType={type}
      queryKey={['achievements/entries', currentDifficulty]}
      setData={setFormState}
      title={`achievement.${type}`}
      onClose={onClose}
    />
  )
}

export default ModifyAchievementModal
