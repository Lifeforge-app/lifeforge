import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import Input from '@components/ButtonsAndInputs/Input'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import { useAuthContext } from '@providers/AuthProvider'
import APIRequest from '@utils/fetchData'

function ModifyModal({
  title,
  id,
  icon,
  isOpen,
  onClose
}: {
  title: string
  id: string
  icon: string
  isOpen: boolean
  onClose: () => void
}): React.ReactElement {
  const { userData, setUserData } = useAuthContext()
  const [value, setValue] = useState(userData[id])
  const [loading, setLoading] = useState(false)

  async function onSubmit(): Promise<void> {
    setLoading(true)
    await APIRequest({
      method: 'PATCH',
      endpoint: '/user/settings',
      body: {
        data: {
          [id]: value
        }
      },
      successInfo: id !== 'email' && 'update',
      failureInfo: id !== 'email' && 'update',
      callback: () => {
        if (id === 'email') {
          toast.info('A verification email has been sent to your new email.')
        } else {
          setUserData({ ...userData, [id]: value })
        }
      },
      onFailure: () => {
        if (id === 'email') {
          toast.error('Failed to send verification email.')
        }
      },
      finalCallback: () => {
        setLoading(false)
        onClose()
      }
    })
  }

  function updateValue(e: React.ChangeEvent<HTMLInputElement>): void {
    setValue(e.target.value)
  }

  return (
    <Modal isOpen={isOpen} className="sm:!min-w-[30rem]">
      <ModalHeader
        title={`Update ${title}`}
        onClose={onClose}
        icon="tabler:pencil"
      />
      <Input
        icon={icon}
        name={title}
        placeholder={`Enter new ${title}`}
        updateValue={updateValue}
        value={value}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onSubmit().catch(console.error)
          }
        }}
      />
      <Button
        onClick={() => {
          onSubmit().catch(console.error)
        }}
        loading={loading}
        icon="tabler:pencil"
        className="mt-6"
      >
        Update
      </Button>
    </Modal>
  )
}

export default ModifyModal
