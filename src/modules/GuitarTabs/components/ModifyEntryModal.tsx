import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import FormModal from '@components/modals/FormModal'
import {
  IGuitarTabsEntryFormState,
  type IGuitarTabsEntry
} from '@interfaces/guitar_tabs_interfaces'
import { IFieldProps } from '@interfaces/modal_interfaces'

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
}): React.ReactElement {
  const { t } = useTranslation('modules.guitarTabs')

  const [formState, setFormState] = useState<IGuitarTabsEntryFormState>({
    name: '',
    author: '',
    type: ''
  })

  const FIELDS: IFieldProps<IGuitarTabsEntryFormState>[] = [
    {
      id: 'name',
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
      data={formState}
      endpoint="guitar-tabs/entries"
      fields={FIELDS}
      icon="tabler:pencil"
      id={existingItem?.id}
      isOpen={isOpen}
      namespace="modules.guitarTabs"
      openType="update"
      queryKey={queryKey}
      setData={setFormState}
      title="update"
      onClose={onClose}
    />
  )
}

export default ModifyEntryModal
