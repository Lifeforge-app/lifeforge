import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { useAuth } from '@lifeforge/shared'
import {
  Box,
  Button,
  ConfirmationModal,
  FilePickerModal,
  Flex,
  Icon,
  OptionsColumn,
  useModalStore
} from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

function AvatarColumn() {
  const { open } = useModalStore()

  const { t } = useTranslation('common.accountSettings')

  const { getAvatarURL, userData, setUserData } = useAuth()

  async function changeAvatar(file: File | string | null) {
    if (file === null) {
      toast.error('No file selected')

      return
    }

    try {
      const data = await forgeAPI.user.settings.updateAvatar.mutate({
        file
      })

      setUserData(userData => (userData ? { ...userData, avatar: data } : null))

      toast.success('Avatar updated successfully')
    } catch {
      toast.error('An error occurred')
    }
  }

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
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteAvatarMutation.mutateAsync(undefined)
      }
    })
  }, [])

  if (!userData) return null

  return (
    <OptionsColumn
      description={t('settings.desc.profilePicture')}
      icon="tabler:camera"
      title={t('settings.title.profilePicture')}
    >
      <Flex
        centered
        shadow
        bg={{ base: 'bg-100', dark: 'bg-800' }}
        flexShrink="0"
        height="3em"
        mr="md"
        overflow="hidden"
        r="full"
        width="3em"
      >
        {userData.avatar !== '' ? (
          <Box
            asChild
            height="100%"
            style={{
              objectFit: 'cover'
            }}
            width="100%"
          >
            <img alt="" src={getAvatarURL()} />
          </Box>
        ) : (
          <Icon color="muted" icon="tabler:user" size="1.5em" />
        )}
      </Flex>
      <Flex align="center" gap="sm" width="100%">
        <Button
          flex="1"
          icon="tabler:photo-hexagon"
          variant={userData.avatar !== '' ? 'secondary' : 'primary'}
          onClick={() =>
            open(FilePickerModal, {
              acceptedMimeTypes: {
                image: ['jpg', 'jpeg', 'png', 'gif']
              },
              enablePixabay: true,
              enableUrl: true,
              enableAI: true,
              onSelect: file => changeAvatar(file)
            })
          }
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
      </Flex>
    </OptionsColumn>
  )
}

export default AvatarColumn
