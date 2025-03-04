import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import ConfigColumn from '@components/utilities/ConfigColumn'
import { useAuthContext } from '@providers/AuthProvider'
import APIRequestV2 from '@utils/newFetchData'

function AvatarColumn(): React.ReactElement {
  const { t } = useTranslation('modules.accountSettings')
  const [loading, setLoading] = useState(false)
  const { getAvatarURL, userData, setUserData } = useAuthContext()
  const [deleteAvatarConfirmationModal, setDeleteAvatarConfirmationModal] =
    useState(false)

  function changeAvatar(): void {
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
          const data = await APIRequestV2<string>('/user/settings/avatar', {
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
        <div className="mr-4 flex size-12 items-center justify-center overflow-hidden rounded-full bg-bg-100 dark:bg-bg-800">
          {userData.avatar !== '' ? (
            <img
              alt=""
              className="size-full object-cover"
              src={getAvatarURL()}
            />
          ) : (
            <Icon className="text-2xl text-bg-500" icon="tabler:user" />
          )}
        </div>
        <div className="flex items-center">
          <Button
            icon="tabler:upload"
            loading={loading}
            variant="no-bg"
            onClick={() => {
              changeAvatar()
            }}
          >
            upload
          </Button>
          <Button
            isRed
            icon="tabler:trash"
            variant="no-bg"
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
        data={{}}
        isOpen={deleteAvatarConfirmationModal}
        itemName="avatar"
        updateDataLists={() => {
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
