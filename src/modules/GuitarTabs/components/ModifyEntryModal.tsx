import { Icon } from '@iconify/react'
import { t } from 'i18next'
import React, { useEffect, useReducer, useState } from 'react'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import Input from '@components/ButtonsAndInputs/Input'
import ListboxOrComboboxInput from '@components/ButtonsAndInputs/ListboxOrComboboxInput'
import ListboxNullOption from '@components/ButtonsAndInputs/ListboxOrComboboxInput/components/ListboxNullOption'
import ListboxOrComboboxOption from '@components/ButtonsAndInputs/ListboxOrComboboxInput/components/ListboxOrComboboxOption'
import ModalHeader from '@components/Modals/ModalHeader'
import ModalWrapper from '@components/Modals/ModalWrapper'
import { type IGuitarTabsEntry } from '@interfaces/guitar_tabs_interfaces'
import APIRequest from '@utils/fetchData'

interface IState {
  name: string
  author: string
  type: 'singalong' | 'fingerstyle' | ''
}

const TYPES = [
  { name: 'Fingerstyle', id: 'fingerstyle', icon: 'mingcute:guitar-line' },
  { name: 'Singalong', id: 'singalong', icon: 'mdi:guitar-pick-outline' }
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

    await APIRequest({
      endpoint: `guitar-tabs/entries/${existingItem?.id}`,
      method: 'PUT',
      body: data,
      successInfo: 'update',
      failureInfo: 'update',
      callback: () => {
        refreshEntries()
        onClose()
      },
      finalCallback: () => {
        setLoading(false)
      }
    })
  }

  return (
    <ModalWrapper isOpen={isOpen} className="md:!min-w-[30vw]">
      <ModalHeader
        icon="tabler:pencil"
        onClose={onClose}
        title="Modify Guitar Tab"
      />
      <Input
        darker
        icon="tabler:music"
        name="Music Name"
        placeholder="A cool tab"
        value={data.name}
        updateValue={value => {
          setData({ name: value })
        }}
      />
      <Input
        darker
        icon="tabler:user"
        name="Author"
        placeholder="John Doe"
        value={data.author}
        updateValue={value => {
          setData({ author: value })
        }}
        className="mt-4"
      />
      <ListboxOrComboboxInput
        name={t('input.scoreType')}
        icon="tabler:category"
        value={data.type}
        setValue={value => {
          setData({ type: value })
        }}
        buttonContent={
          <>
            <Icon
              icon={
                data.type !== ''
                  ? {
                      fingerstyle: 'mingcute:guitar-line',
                      singalong: 'mdi:guitar-pick-outline'
                    }[data.type]
                  : 'tabler:music-off'
              }
              className="size-5"
            />
            <span className="-mt-px block truncate">
              {data.type !== ''
                ? data.type[0].toUpperCase() + data.type.slice(1)
                : 'None'}
            </span>
          </>
        }
      >
        <ListboxNullOption icon="tabler:music-off" />
        {TYPES.map(({ name, id, icon }) => (
          <ListboxOption key={id} text={name} icon={icon} value={id} />
        ))}
      </ListboxOrComboboxInput>
      <CreateOrModifyButton
        type="update"
        loading={loading}
        onClick={() => {
          onSubmit().catch(console.error)
        }}
      />
    </ModalWrapper>
  )
}

export default ModifyEntryModal
