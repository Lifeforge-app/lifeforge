import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { usePersonalization } from '@lifeforge/ui'
import {
  Button,
  ConfirmationModal,
  FilePickerModal,
  Flex,
  OptionsColumn,
  useModalStore
} from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

import AdjustBgImageModal from './modals/AdjustBgImageModal'

function BgImageSelector() {
  const { open } = useModalStore()

  const { t } = useTranslation('common.personalization')

  const { bgImage } = usePersonalization()

  const { setBgImage, setBackdropFilters } = usePersonalization()

  const handleAdjustBgImage = useCallback(() => {
    open(AdjustBgImageModal, {})
  }, [])

  const deleteMutation = useMutation(
    forgeAPI.user.personalization.deleteBgImage.mutationOptions({
      onSuccess: () => {
        setBgImage('')
        setBackdropFilters({
          brightness: 100,
          blur: 'none',
          contrast: 100,
          saturation: 100,
          overlayOpacity: 50
        })
      },
      onError: () => {
        toast.error('Failed to delete background image')
      }
    })
  )

  const handleDeleteBgImage = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Background Image',
      description: 'Are you sure you want to delete your background image?',
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(undefined)
      }
    })
  }, [])

  async function onSubmit(file: string | File) {
    try {
      const data = await forgeAPI.user.personalization.updateBgImage.mutate({
        file
      })

      setBgImage(forgeAPI.getMedia(data))
      toast.success('Background image updated')
    } catch {
      toast.error('Failed to update background image')
    }
  }

  const handleOpenImageSelector = useCallback(() => {
    open(FilePickerModal, {
      mimeTypes: {
        image: ['png', 'jpg', 'jpeg', 'gif', 'webp']
      },
      sources: {
        pixabay: true,
        url: true,
        ai: {
          defaultPrompt:
            'Generate a minimalistic dark-themed background image with a cyberpunk themed neon green colored cube at the middle, the aspect ratio should be 16:9.'
        }
      },
      enableAI: true,
      onSelect: onSubmit
    })
  }, [onSubmit])

  return (
    <>
      <OptionsColumn
        description={t('bgImageSelector.desc')}
        icon="tabler:photo"
        title={t('bgImageSelector.title')}
      >
        {bgImage !== '' ? (
          <Flex
            direction={{ base: 'column', md: 'row' }}
            gap="sm"
            width={{ base: '100%', md: 'auto' }}
          >
            <Button
              icon="tabler:adjustments"
              variant="plain"
              width={{ base: '100%', md: 'auto' }}
              onClick={handleAdjustBgImage}
            >
              adjust
            </Button>
            <Button
              dangerous
              icon="tabler:trash"
              variant="plain"
              width={{ base: '100%', md: 'auto' }}
              onClick={handleDeleteBgImage}
            >
              remove
            </Button>
          </Flex>
        ) : (
          <Button
            icon="tabler:photo-hexagon"
            variant="secondary"
            width={{ base: '100%', md: 'auto' }}
            onClick={handleOpenImageSelector}
          >
            select
          </Button>
        )}
      </OptionsColumn>
    </>
  )
}

export default BgImageSelector
