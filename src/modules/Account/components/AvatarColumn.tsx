import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@components/ButtonsAndInputs/Button'
import ConfigColumn from '@components/Miscellaneous/ConfigColumn'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import { useAuthContext } from '@providers/AuthProvider'
import APIRequest from '@utils/fetchData'

function AvatarColumn(): React.ReactElement {
  const { t } = useTranslation()
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
        await APIRequest({
          method: 'PUT',
          endpoint: '/user/settings/avatar',
          body: formData,
          isJSON: false,
          successInfo: 'update',
          failureInfo: 'update',
          callback: data => {
            setUserData({ ...userData, avatar: data.data })
          },
          finalCallback: () => {
            setLoading(false)
          }
        })
      }
    }
  }

  return (
    <>
      <ConfigColumn
        title={t('accountSettings.title.profilePicture')}
        desc={t('accountSettings.desc.profilePicture')}
        icon="tabler:camera"
      >
        <div className="mr-4 flex size-12 items-center justify-center overflow-hidden rounded-full bg-bg-100 dark:bg-bg-800">
          {userData.avatar !== '' ? (
            <img
              src={getAvatarURL()}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <Icon icon="tabler:user" className="text-2xl text-bg-500" />
          )}
        </div>
        <div className="flex items-center">
          <Button
            onClick={() => {
              changeAvatar()
            }}
            loading={loading}
            variant="no-bg"
            icon="tabler:upload"
          >
            upload
          </Button>
          <Button
            onClick={() => {
              setDeleteAvatarConfirmationModal(true)
            }}
            variant="no-bg"
            icon="tabler:trash"
            isRed
          >
            remove
          </Button>
        </div>
      </ConfigColumn>
      <DeleteConfirmationModal
        apiEndpoint="/user/settings/avatar"
        data={{}}
        itemName="avatar"
        updateDataList={() => {
          setUserData({ ...userData, avatar: '' })
        }}
        isOpen={deleteAvatarConfirmationModal}
        onClose={() => {
          setDeleteAvatarConfirmationModal(false)
        }}
        customText="Are you sure you want to remove your profile picture?"
      />
    </>
  )
}

export default AvatarColumn
