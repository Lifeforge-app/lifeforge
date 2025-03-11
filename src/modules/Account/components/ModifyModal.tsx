import moment from 'moment'
import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
import { DateInput, TextInput } from '@components/inputs'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import { useAuthContext } from '@providers/AuthProvider'
import fetchAPI from '@utils/fetchAPI'
import { toCamelCase } from '@utils/strings'

function ModifyModal({
  type,
  title,
  id,
  icon,
  isOpen,
  onClose
}: {
  type?: string
  title: string
  id: string
  icon: string
  isOpen: boolean
  onClose: () => void
}): React.ReactElement {
  const { userData, setUserData } = useAuthContext()
  const [value, setValue] = useState(userData[id])
  const [loading, setLoading] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  async function onSubmit(): Promise<void> {
    setLoading(true)

    try {
      await fetchAPI('/user/settings', {
        method: 'PATCH',
        body: {
          data: {
            [id]:
              type === 'date'
                ? moment(value).subtract(1, 'second').format('YYYY-MM-DD')
                : value
          }
        }
      })

      if (id === 'email') {
        toast.info('A verification email has been sent to your new email.')
      } else {
        setUserData({ ...userData, [id]: value })
      }
    } catch {
      if (id === 'email') {
        toast.error('Failed to send verification email.')
      } else {
        toast.error('An error occurred.')
      }
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <ModalWrapper isOpen={isOpen} minWidth="30rem" modalRef={modalRef}>
      <ModalHeader
        icon="tabler:pencil"
        namespace="modules.accountSettings"
        title={`${toCamelCase(title)}.update`}
        onClose={onClose}
      />
      {type !== 'date' ? (
        <TextInput
          icon={icon}
          name={title}
          namespace="modules.accountSettings"
          placeholder={`Enter new ${title}`}
          setValue={setValue}
          value={value}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onSubmit().catch(console.error)
            }
          }}
        />
      ) : (
        <DateInput
          darker
          date={value}
          icon={icon}
          modalRef={modalRef}
          name={title}
          namespace="modules.accountSettings"
          setDate={setValue}
        />
      )}
      <Button
        className="mt-6"
        icon="tabler:pencil"
        loading={loading}
        onClick={() => {
          onSubmit().catch(console.error)
        }}
      >
        Update
      </Button>
    </ModalWrapper>
  )
}

export default ModifyModal
