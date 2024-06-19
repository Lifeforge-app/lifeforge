import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@components/ButtonsAndInputs/Button'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import { useAuthContext } from '@providers/AuthProvider'
import APIRequest from '@utils/fetchData'

function Account(): React.ReactElement {
  const { t } = useTranslation()
  const { getAvatarURL, userData, setUserData } = useAuthContext()
  const [uploadImageLoading, setUploadImageLoading] = useState(false)
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

        setUploadImageLoading(true)
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
            setUploadImageLoading(false)
          }
        })
      }
    }
  }

  return (
    <ModuleWrapper>
      <ModuleHeader title="Account Settings" desc="..." />
      <div className="relative z-20 mt-4 flex w-full flex-col items-center justify-between gap-6 px-4 md:flex-row">
        <div className="mt-6 w-full md:w-auto">
          <h3 className="block text-xl font-medium leading-normal">
            {t('accountSettings.title.profilePicture')}
          </h3>
          <p className="text-bg-500">
            {t('accountSettings.desc.profilePicture')}
          </p>
        </div>
        <div className="flex items-center">
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
          <Button
            onClick={() => {
              changeAvatar()
            }}
            disabled={uploadImageLoading}
            type="no-bg"
            icon={
              uploadImageLoading ? 'svg-spinners:180-ring' : 'tabler:upload'
            }
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
      <div className="my-6 w-full border-b-[1.5px] border-bg-200 dark:border-bg-800" />
      <div className="relative z-20 flex w-full flex-col items-center justify-between gap-6 px-4 md:flex-row">
        <div className="w-full md:w-auto">
          <h3 className="block text-xl font-medium leading-normal">
            {t('accountSettings.title.username')}
          </h3>
          <p className="text-bg-500">{t('accountSettings.desc.username')}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-bg-500">{userData.username}</span>
          <Button onClick={() => {}} type="no-bg" icon="tabler:pencil" />
        </div>
      </div>
      <div className="my-6 w-full border-b-[1.5px] border-bg-200 dark:border-bg-800" />
      <div className="relative z-20 flex w-full flex-col items-center justify-between gap-6 px-4 md:flex-row">
        <div className="w-full md:w-auto">
          <h3 className="block text-xl font-medium leading-normal">
            {t('accountSettings.title.displayName')}
          </h3>
          <p className="text-bg-500">{t('accountSettings.desc.displayName')}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-bg-500">{userData.name}</span>
          <Button onClick={() => {}} type="no-bg" icon="tabler:pencil" />
        </div>
      </div>
      <div className="my-6 w-full border-b-[1.5px] border-bg-200 dark:border-bg-800" />
      <div className="relative z-20 flex w-full flex-col items-center justify-between gap-6 px-4 md:flex-row">
        <div className="w-full md:w-auto">
          <h3 className="block text-xl font-medium leading-normal">
            {t('accountSettings.title.email')}
          </h3>
          <p className="text-bg-500">{t('accountSettings.desc.email')}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-bg-500">{userData.email}</span>
          <Button onClick={() => {}} type="no-bg" icon="tabler:pencil" />
        </div>
      </div>
      <div className="my-6 w-full border-b-[1.5px] border-bg-200 dark:border-bg-800" />
      <div className="relative z-20 flex w-full flex-col items-center justify-between gap-6 px-4 md:flex-row">
        <div className="w-full md:w-auto">
          <h3 className="block text-xl font-medium leading-normal">
            {t('accountSettings.title.password')}
          </h3>
          <p className="text-bg-500">{t('accountSettings.desc.password')}</p>
        </div>
        <Button onClick={() => {}} type="secondary" icon="tabler:key">
          change password
        </Button>
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
    </ModuleWrapper>
  )
}

export default Account
