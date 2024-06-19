import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@components/ButtonsAndInputs/Button'
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
      <div className="relative z-20 mt-4 flex w-full flex-col items-center justify-between gap-6 px-4 md:flex-row">
        <div className="mt-6 w-full md:w-auto">
          <h3 className="block text-xl font-medium leading-normal">
            {t('accountSettings.title.profilePicture')}
          </h3>
          <p className="text-bg-500">
            {t('accountSettings.desc.profilePicture')}
          </p>
        </div>
        <div className="flex w-full items-center justify-between md:w-auto">
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
              disabled={loading}
              type="no-bg"
              icon={loading ? 'svg-spinners:180-ring' : 'tabler:upload'}
            >
              upload
            </Button>
            <Button
              onClick={() => {
                setDeleteAvatarConfirmationModal(true)
              }}
              type="no-bg"
              icon="tabler:trash"
              isRed
            >
              remove
            </Button>
          </div>
        </div>
      </div>
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
