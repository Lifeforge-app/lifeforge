import { Icon } from '@iconify/react/dist/iconify.js'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import Input from '@components/ButtonsAndInputs/Input'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'
import ListboxNullOption from '@components/ButtonsAndInputs/ListboxInput/components/ListboxNullOption'
import ListboxOption from '@components/ButtonsAndInputs/ListboxInput/components/ListboxOption'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import { type IGuitarTabsEntry } from '@interfaces/guitar_tabs_interfaces'
import APIRequest from '@utils/fetchData'

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
  const [name, setName] = useState('')
  const [author, setAuthor] = useState('')
  const [type, setType] = useState<'singalong' | 'fingerstyle' | ''>('')
  const [loading, setLoading] = useState(false)

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setName(e.target.value)
  }

  function handleAuthorChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setAuthor(e.target.value)
  }

  useEffect(() => {
    if (existingItem !== null) {
      setName(existingItem.name)
      setAuthor(existingItem.author)
      setType(existingItem.type)
    } else {
      setName('')
      setAuthor('')
      setType('')
    }
  }, [existingItem])

  async function onSubmit(): Promise<void> {
    setLoading(true)

    await APIRequest({
      endpoint: `/guitar-tabs/${existingItem?.id}`,
      method: 'PUT',
      body: {
        name,
        author,
        type
      },
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
    <Modal isOpen={isOpen} className="md:!min-w-[30vw]">
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
        value={name}
        updateValue={handleNameChange}
      />
      <Input
        darker
        icon="tabler:user"
        name="Author"
        placeholder="John Doe"
        value={author}
        updateValue={handleAuthorChange}
        className="mt-4"
      />
      <ListboxInput
        name={t('input.scoreType')}
        icon="tabler:category"
        value={type}
        setValue={setType}
        buttonContent={
          <>
            <Icon
              icon={
                type !== ''
                  ? {
                      fingerstyle: 'mingcute:guitar-line',
                      singalong: 'mdi:guitar-pick-outline'
                    }[type]
                  : 'tabler:music-off'
              }
              className="size-5"
            />
            <span className="-mt-px block truncate">
              {type !== '' ? type[0].toUpperCase() + type.slice(1) : 'None'}
            </span>
          </>
        }
      >
        <ListboxNullOption icon="tabler:music-off" />
        {TYPES.map(({ name, id, icon }) => (
          <ListboxOption key={id} text={name} icon={icon} value={id} />
        ))}
      </ListboxInput>
      <CreateOrModifyButton
        type="update"
        loading={loading}
        onClick={() => {
          onSubmit().catch(console.error)
        }}
      />
    </Modal>
  )
}

export default ModifyEntryModal
