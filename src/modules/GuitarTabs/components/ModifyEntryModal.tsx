import { Icon } from '@iconify/react'

import React, { useEffect, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { CreateOrModifyButton } from '@components/buttons'
import {
  TextInput,
  ListboxOrComboboxInput,
  ListboxNullOption,
  ListboxOrComboboxOption
} from '@components/inputs'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import { type IGuitarTabsEntry } from '@interfaces/guitar_tabs_interfaces'
import fetchAPI from '@utils/fetchAPI'

interface IState {
  name: string
  author: string
  type: 'singalong' | 'fingerstyle' | ''
}

const TYPES = [
  { id: 'fingerstyle', icon: 'mingcute:guitar-line' },
  { id: 'singalong', icon: 'mdi:guitar-pick-outline' }
]

function ModifyEntryModal({
  isOpen,
  onClose,
  existingItem,
  refreshEntries
}: {
  isOpen: boolean
  onClose: () => void
  existingItem: IGuitarTabsEntry | null
  refreshEntries: () => void
}): React.ReactElement {
  const { t } = useTranslation('modules.guitarTabs')

  function reducer(state: IState, action: Partial<IState>): IState {
    return { ...state, ...action }
  }

  const [data, setData] = useReducer(reducer, {
    name: '',
    author: '',
    type: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (existingItem !== null) {
      setData({
        name: existingItem.name,
        author: existingItem.author,
        type: existingItem.type
      })
    } else {
      setData({
        name: '',
        author: '',
        type: ''
      })
    }
  }, [existingItem])

  async function onSubmit(): Promise<void> {
    setLoading(true)

    try {
      await fetchAPI(`guitar-tabs/entries/${existingItem?.id}`, {
        method: 'PATCH',
        body: data as any as Record<string, unknown>
      })
      refreshEntries()
      onClose()
    } catch {
      toast.error('Failed to update guitar tab data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalWrapper className="md:min-w-[30vw]!" isOpen={isOpen}>
      <ModalHeader
        icon="tabler:pencil"
        namespace="modules.guitarTabs"
        title="guitarTabs.update"
        onClose={onClose}
      />
      <TextInput
        darker
        icon="tabler:music"
        name="Music Name"
        namespace="modules.guitarTabs"
        placeholder="A cool tab"
        setValue={value => {
          setData({ name: value })
        }}
        value={data.name}
      />
      <TextInput
        darker
        className="mt-4"
        icon="tabler:user"
        name="Author"
        namespace="modules.guitarTabs"
        placeholder="John Doe"
        setValue={value => {
          setData({ author: value })
        }}
        value={data.author}
      />
      <ListboxOrComboboxInput
        buttonContent={
          <>
            <Icon
              className="size-5"
              icon={
                data.type !== ''
                  ? {
                      fingerstyle: 'mingcute:guitar-line',
                      singalong: 'mdi:guitar-pick-outline'
                    }[data.type]
                  : 'tabler:music-off'
              }
            />
            <span className="-mt-px block truncate">
              {data.type !== ''
                ? t(`scoreTypes.${data.type}`)
                : t('scoreTypes.uncategorized')}
            </span>
          </>
        }
        icon="tabler:category"
        name="Score Type"
        namespace="modules.guitarTabs"
        setValue={value => {
          setData({ type: value })
        }}
        type="listbox"
        value={data.type}
      >
        <ListboxNullOption
          icon="tabler:music-off"
          text={t('scoreTypes.uncategorized')}
        />
        {TYPES.map(({ id, icon }) => (
          <ListboxOrComboboxOption
            key={id}
            icon={icon}
            text={t(`scoreTypes.${id}`)}
            value={id}
          />
        ))}
      </ListboxOrComboboxInput>
      <CreateOrModifyButton
        loading={loading}
        type="update"
        onClick={() => {
          onSubmit().catch(console.error)
        }}
      />
    </ModalWrapper>
  )
}

export default ModifyEntryModal
