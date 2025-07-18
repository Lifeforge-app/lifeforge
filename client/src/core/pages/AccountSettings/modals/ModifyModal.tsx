import dayjs from 'dayjs'
import { Button, DateInput, ModalHeader, TextInput } from 'lifeforge-ui'
import _ from 'lodash'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'

import { useAuth } from '../../../providers/AuthProvider'

function ModifyModal({
  data: { type, title, id, icon },
  onClose
}: {
  data: { type?: string; title: string; id: string; icon: string }
  onClose: () => void
}) {
  const { userData, setUserData } = useAuth()
  const [value, setValue] = useState(userData[id])
  const [loading, setLoading] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  async function onSubmit() {
    setLoading(true)

    try {
      await fetchAPI(import.meta.env.VITE_API_URL, '/user/settings', {
        method: 'PATCH',
        body: {
          data: {
            [id]:
              type === 'date'
                ? dayjs(value).subtract(1, 'second').format('YYYY-MM-DD')
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
    <div ref={modalRef} className="sm:min-w-[30rem]">
      <ModalHeader
        icon="tabler:pencil"
        namespace="core.accountSettings"
        title={`${_.camelCase(title)}.update`}
        onClose={onClose}
      />
      {type !== 'date' ? (
        <TextInput
          darker
          icon={icon}
          name={title}
          namespace="core.accountSettings"
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
          name={title}
          namespace="core.accountSettings"
          setDate={setValue}
        />
      )}
      <Button
        className="mt-6 w-full"
        icon="tabler:pencil"
        loading={loading}
        onClick={() => {
          onSubmit().catch(console.error)
        }}
      >
        Update
      </Button>
    </div>
  )
}

export default ModifyModal
