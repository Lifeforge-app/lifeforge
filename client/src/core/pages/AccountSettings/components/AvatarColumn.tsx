import { Icon } from '@iconify/react'
import { Button, ConfigColumn, DeleteConfirmationModal } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'

import { useAuth } from '../../../providers/AuthProvider'

function AvatarColumn() {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('core.accountSettings')

  const [loading, setLoading] = useState(false)

  const { getAvatarURL, userData, setUserData } = useAuth()

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
          const data = await fetchAPI<string>(
            import.meta.env.VITE_API_HOST,
            '/user/settings/avatar',
            {
              method: 'PUT',
              body: formData
            }
          )

          setUserData({ ...userData, avatar: data })
        } catch {
          toast.error('An error occurred')
        } finally {
          setLoading(false)
        }
      }
    }
  }

  const handleDeleteAvatar = useCallback(() => {
    open(DeleteConfirmationModal, {
      apiEndpoint: '/user/settings/avatar',
      customText: 'Are you sure you want to remove your profile picture?',
      itemName: 'avatar',
      afterDelete: async () => {
        setUserData((userData: any) => ({
          ...userData,
          avatar: ''
        }))
      }
    })
  }, [])

  return (
    <ConfigColumn
      desc={t('settings.desc.profilePicture')}
      icon="tabler:camera"
      title={t('settings.title.profilePicture')}
    >
      <div className="bg-bg-100 dark:bg-bg-800 mr-4 flex size-12 items-center justify-center overflow-hidden rounded-full">
        {userData.avatar !== '' ? (
          <img alt="" className="size-full object-cover" src={getAvatarURL()} />
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
        {userData.avatar !== '' && (
          <Button
            isRed
            icon="tabler:trash"
            variant="plain"
            onClick={handleDeleteAvatar}
          >
            remove
          </Button>
        )}
      </div>
    </ConfigColumn>
  )
}

export default AvatarColumn
