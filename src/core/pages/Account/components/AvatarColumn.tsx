import { Icon } from '@iconify/react'
import { useAuth } from '@providers/AuthProvider'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { Button, ConfigColumn, DeleteConfirmationModal } from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

function AvatarColumn() {
  const { t } = useTranslation('core.accountSettings')
  const [loading, setLoading] = useState(false)
  const { getAvatarURL, userData, setUserData } = useAuth()
  const [deleteAvatarConfirmationModal, setDeleteAvatarConfirmationModal] =
    useState(false)

  function changeAvatar() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (file !== undefined) {
        const formData = new FormData()
        formData.append('file', file)

        setLoading(true)

        try {
          const data = await fetchAPI<string>('/user/settings/avatar', {
            method: 'PUT',
            body: formData
          })
          setUserData({ ...userData, avatar: data })
        } catch {
          toast.error('An error occurred')
        } finally {
          setLoading(false)
        }
      }
    }
  }

  return (
    <>
      <ConfigColumn
        desc={t('settings.desc.profilePicture')}
        icon="tabler:camera"
        title={t('settings.title.profilePicture')}
      >
        <div className="bg-bg-100 dark:bg-bg-800 mr-4 flex size-12 items-center justify-center overflow-hidden rounded-full">
          {userData.avatar !== '' ? (
            <img
              alt=""
              className="size-full object-cover"
              src={getAvatarURL()}
            />
          ) : (
            <Icon className="text-bg-500 text-2xl" icon="tabler:user" />
          )}
        </div>
        <div className="flex items-center">
          <Button
            icon="tabler:upload"
            loading={loading}
            variant="plain"
            onClick={() => {
              changeAvatar()
            }}
          >
            upload
          </Button>
          <Button
            isRed
            icon="tabler:trash"
            variant="plain"
            onClick={() => {
              setDeleteAvatarConfirmationModal(true)
            }}
          >
            remove
          </Button>
        </div>
      </ConfigColumn>
      <DeleteConfirmationModal
        apiEndpoint="/user/settings/avatar"
        customText="Are you sure you want to remove your profile picture?"
        data={undefined}
        isOpen={deleteAvatarConfirmationModal}
        itemName="avatar"
        updateDataList={() => {
          setUserData({ ...userData, avatar: '' })
        }}
        onClose={() => {
          setDeleteAvatarConfirmationModal(false)
        }}
      />
    </>
  )
}

export default AvatarColumn
