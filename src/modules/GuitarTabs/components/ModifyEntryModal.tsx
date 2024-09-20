import { ListboxOption } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import Input from '@components/ButtonsAndInputs/Input'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'
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
  const [type, setType] = useState<'singalong' | 'fingerstyle' | null>(null)
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
      setType(existingItem.type === '' ? null : existingItem.type)
    } else {
      setName('')
      setAuthor('')
      setType(null)
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
        name="Type"
        icon="tabler:category"
        value={type}
        setValue={setType}
        buttonContent={
          <>
            <Icon
              icon={
                type !== null
                  ? {
                      fingerstyle: 'mingcute:guitar-line',
                      singalong: 'mdi:guitar-pick-outline'
                    }[type]
                  : 'tabler:music-off'
              }
              className="size-5"
            />
            <span className="-mt-px block truncate">
              {type !== null ? type[0].toUpperCase() + type.slice(1) : 'None'}
            </span>
          </>
        }
      >
        <ListboxOption
          key="none"
          className="flex-between relative flex cursor-pointer select-none p-4 text-bg-500 transition-all hover:bg-bg-100 data-[selected]:text-bg-800 hover:dark:bg-bg-700/50 data-[selected]:dark:text-bg-50"
          value={null}
        >
          {({ selected }) => (
            <>
              <div>
                <span className="flex items-center gap-2 font-medium">
                  <Icon icon="tabler:music-off" className="size-5" />
                  None
                </span>
              </div>
              {selected && (
                <Icon
                  icon="tabler:check"
                  className="block text-lg text-custom-500"
                />
              )}
            </>
          )}
        </ListboxOption>
        {TYPES.map(({ name, id, icon }) => (
          <ListboxOption
            key={id}
            className="flex-between relative flex cursor-pointer select-none p-4 text-bg-500 transition-all hover:bg-bg-100 data-[selected]:text-bg-800 hover:dark:bg-bg-700/50 data-[selected]:dark:text-bg-50"
            value={id}
          >
            {({ selected }) => (
              <>
                <div>
                  <span className="flex items-center gap-2 font-medium">
                    <Icon icon={icon} className="size-5" />
                    {name}
                  </span>
                </div>
                {selected && (
                  <Icon
                    icon="tabler:check"
                    className="block text-lg text-custom-500"
                  />
                )}
              </>
            )}
          </ListboxOption>
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
