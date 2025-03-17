import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import COLOR from 'tailwindcss/colors'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import {
  type IAchievementEntry,
  IAchievementEntryFormState
} from './interfaces/achievements_interfaces'

const difficulties = [
  ['easy', 'green'],
  ['medium', 'yellow'],
  ['hard', 'red'],
  ['impossible', 'purple']
]

function ModifyAchievementModal({
  openType,
  setOpenType,
  existedData,
  currentDifficulty
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  existedData: IAchievementEntry | null
  currentDifficulty: IAchievementEntry['difficulty']
}) {
  const { t } = useTranslation('modules.achievements')
  const [formState, setFormState] = useState<IAchievementEntryFormState>({
    title: '',
    thoughts: '',
    difficulty: 'easy'
  })

  const FIELDS: IFieldProps<IAchievementEntryFormState>[] = [
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
    if (openType === 'update' && existedData !== null) {
      setFormState(existedData)
    } else {
      setFormState({
        title: '',
        thoughts: '',
        difficulty: currentDifficulty
      })
    }
  }, [openType, existedData])

  return (
    <FormModal
      data={formState}
      endpoint="achievements/entries"
      fields={FIELDS}
      icon={
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[openType!]
      }
      id={existedData?.id}
      isOpen={openType !== null}
      namespace="modules.achievements"
      openType={openType}
      queryKey={['achievements/entries', currentDifficulty]}
      setData={setFormState}
      title={`achievement.${openType}`}
      onClose={() => {
        setOpenType(null)
      }}
    />
  )
}

export default ModifyAchievementModal
