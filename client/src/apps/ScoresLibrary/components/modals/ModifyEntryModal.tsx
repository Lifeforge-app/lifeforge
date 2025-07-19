import { useQueryClient } from '@tanstack/react-query'
import { FormModal } from 'lifeforge-ui'
import { type IFieldProps } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  ISchemaWithPB,
  ScoresLibraryCollectionsSchemas
} from 'shared/types/collections'
import { ScoresLibraryControllersSchemas } from 'shared/types/controllers'

const TYPES = [
  { id: 'fingerstyle', icon: 'mingcute:guitar-line' },
  { id: 'singalong', icon: 'mdi:guitar-pick-outline' }
]

function ModifyEntryModal({
  onClose,
  data: { existedData, queryKey }
}: {
  onClose: () => void
  data: {
    existedData: ISchemaWithPB<ScoresLibraryCollectionsSchemas.IEntry> | null
    queryKey: unknown[]
  }
}) {
  const { t } = useTranslation('apps.scoresLibrary')

  const queryClient = useQueryClient()

  const [formState, setFormState] = useState<
    ScoresLibraryControllersSchemas.IEntries['updateEntry']['body']
  >({
    name: '',
    author: '',
    type: ''
  })

  const FIELDS: IFieldProps<typeof formState>[] = [
    {
      id: 'name',
      required: true,
      label: 'Music Name',
      icon: 'tabler:music',
      placeholder: 'A cool tab',
      type: 'text'
    },
    {
      id: 'author',
      label: 'Author',
      icon: 'tabler:user',
      placeholder: 'John Doe',
      type: 'text'
    },
    {
      id: 'type',
      required: true,
      label: 'Score Type',
      icon: 'tabler:category',
      type: 'listbox',
      options: [
        {
          value: '',
          text: t('scoreTypes.uncategorized'),
          icon: 'tabler:music-off'
        },
        ...TYPES.map(({ id, icon }) => ({
          value: id,
          text: t(`scoreTypes.${id}`),
          icon
        }))
      ]
    }
  ]

  useEffect(() => {
    if (existedData !== null) {
      setFormState({
        name: existedData.name,
        author: existedData.author,
        type: existedData.type
      })
    } else {
      setFormState({
        name: '',
        author: '',
        type: ''
      })
    }
  }, [existedData])

  return (
    <FormModal
      customUpdateDataList={{
        update: () => {
          queryClient.invalidateQueries({ queryKey })
        }
      }}
      data={formState}
      endpoint="scores-library/entries"
      fields={FIELDS}
      icon="tabler:pencil"
      id={existedData?.id}
      namespace="apps.scoresLibrary"
      openType="update"
      queryKey={queryKey}
      setData={setFormState}
      title="scoresLibrary.update"
      onClose={onClose}
    />
  )
}

export default ModifyEntryModal
