import { Icon } from '@iconify/react'
import { useMutation } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  Button,
  ConfigColumn,
  ConfirmationModal,
  FilePickerModal
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { usePromiseLoading } from 'shared'

import { useAuth } from '../../../providers/AuthProvider'

function AvatarColumn() {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('core.accountSettings')

  const { getAvatarURL, userData, setUserData } = useAuth()

  if (!userData) return null

  async function changeAvatar(file: File | string | null) {
    if (file === null) {
      toast.error('No file selected')

      return
    }

    setLoading(true)

    try {
      const data = await forgeAPI.user.settings.updateAvatar.mutate({
        file
      })

      setUserData(userData => (userData ? { ...userData, avatar: data } : null))

      toast.success('Avatar updated successfully')
    } catch {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const [loading, onSubmit] = usePromiseLoading(changeAvatar)

  const deleteAvatarMutation = useMutation(
    forgeAPI.user.settings.deleteAvatar.mutationOptions({
      onSuccess: () => {
        setUserData(userData => (userData ? { ...userData, avatar: '' } : null))
        toast.success('Avatar removed successfully')
      },
      onError: () => {
        toast.error('Failed to remove avatar')
      }
    })
  )

  const handleDeleteAvatar = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Avatar',
      description:
        'Are you sure you want to delete your avatar? This action cannot be undone.',
      buttonType: 'delete',
      onConfirm: async () => {
        await deleteAvatarMutation.mutateAsync({})
      }
    })
  }, [])

  const handleChangeAvatar = useCallback(() => {
    open(FilePickerModal, {
      acceptedMimeTypes: {
        'image/*': ['.jpg', '.jpeg', '.png', '.gif']
      },
      enablePixabay: true,
      enableUrl: true,
      enableAI: true,
      onSelect: file => changeAvatar(file)
    })
  }, [])

  return (
    <ConfigColumn
      desc={t('settings.desc.profilePicture')}
      icon="tabler:camera"
      title={t('settings.title.profilePicture')}
    >
      <div className="bg-bg-100 shadow-custom dark:bg-bg-800 mr-4 flex size-12 items-center justify-center overflow-hidden rounded-full">
        {userData.avatar !== '' ? (
          <img alt="" className="size-full object-cover" src={getAvatarURL()} />
        ) : (
          <Icon className="text-bg-500 text-2xl" icon="tabler:user" />
        )}
      </div>
      <div className="flex items-center">
        <Button
          icon="tabler:photo-hexagon"
          loading={loading}
          variant={userData.avatar !== '' ? 'plain' : 'primary'}
          onClick={onSubmit}
        >
          select
        </Button>
        {userData.avatar !== '' && (
          <Button
            dangerous
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
