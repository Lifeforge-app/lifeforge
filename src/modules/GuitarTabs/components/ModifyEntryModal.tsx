import React, { useEffect, useState } from 'react'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import Input from '@components/ButtonsAndInputs/Input'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import type IGuitarTabsEntry from '@interfaces/guitar_tabs_interfaces'
import APIRequest from '@utils/fetchData'

function ModifyEntryModal({
  isOpen,
  onClose,
  existingItem,
  setEntries
}: {
  isOpen: boolean
  onClose: () => void
  existingItem: IGuitarTabsEntry | null
  setEntries: React.Dispatch<
    React.SetStateAction<
      | {
          totalItems: number
          totalPages: number
          page: number
          items: IGuitarTabsEntry[]
        }
      | 'loading'
      | 'error'
    >
  >
}): React.ReactElement {
  const [name, setName] = useState('')
  const [author, setAuthor] = useState('')
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
    }
  }, [existingItem])

  async function onSubmit(): Promise<void> {
    setLoading(true)

    await APIRequest({
      endpoint: `/guitar-tabs/update/${existingItem?.id}`,
      method: 'PUT',
      body: {
        name,
        author
      },
      successInfo: 'update',
      failureInfo: 'update',
      callback: data => {
        setEntries(prev => {
          if (typeof prev === 'string') return prev
          return {
            ...prev,
            items: prev.items.map(item =>
              item.id === existingItem?.id ? data.data : item
            )
          }
        })
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
        icon="tabler:music"
        name="Music Name"
        placeholder="A cool tab"
        value={name}
        updateValue={handleNameChange}
      />
      <Input
        icon="tabler:user"
        name="Author"
        placeholder="John Doe"
        value={author}
        updateValue={handleAuthorChange}
        additionalClassName="mt-4"
      />
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
