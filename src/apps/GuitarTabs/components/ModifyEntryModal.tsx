import { useQueryClient } from '@tanstack/react-query'
import { ListResult } from 'pocketbase'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import {
  type IGuitarTabsEntry,
  IGuitarTabsEntryFormState
} from '../interfaces/guitar_tabs_interfaces'

const TYPES = [
  { id: 'fingerstyle', icon: 'mingcute:guitar-line' },
  { id: 'singalong', icon: 'mdi:guitar-pick-outline' }
]

function ModifyEntryModal({
  isOpen,
  onClose,
  existingItem,
  queryKey
}: {
  isOpen: boolean
  onClose: () => void
  existingItem: IGuitarTabsEntry | null
  queryKey: unknown[]
}) {
  const { t } = useTranslation('apps.guitarTabs')
  const queryClient = useQueryClient()

  const [formState, setFormState] = useState<IGuitarTabsEntryFormState>({
    name: '',
    author: '',
    type: ''
  })

  const FIELDS: IFieldProps<IGuitarTabsEntryFormState>[] = [
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
    if (existingItem !== null) {
      setFormState({
        name: existingItem.name,
        author: existingItem.author,
        type: existingItem.type
      })
    } else {
      setFormState({
        name: '',
        author: '',
        type: ''
      })
    }
  }, [existingItem])

  return (
    <FormModal
      customUpdateDataList={{
        update: (newData: IGuitarTabsEntry) => {
          queryClient.setQueryData<ListResult<IGuitarTabsEntry>>(
            queryKey,
            oldData => {
              if (oldData === undefined) return oldData

              return {
                ...oldData,
                items: oldData.items.map(item =>
                  item.id === newData.id ? newData : item
                )
              }
            }
          )
        }
      }}
      data={formState}
      endpoint="guitar-tabs/entries"
      fields={FIELDS}
      icon="tabler:pencil"
      id={existingItem?.id}
      isOpen={isOpen}
      namespace="apps.guitarTabs"
      openType="update"
      queryKey={queryKey}
      setData={setFormState}
      title="update"
      onClose={onClose}
    />
  )
}

export default ModifyEntryModal
