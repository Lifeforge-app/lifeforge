import { useMutation } from '@tanstack/react-query'
import {
  Button,
  ConfirmationModal,
  FilePickerModal,
  OptionsColumn
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { usePersonalization } from 'shared'

import forgeAPI from '@/utils/forgeAPI'

import AdjustBgImageModal from './modals/AdjustBgImageModal'

function BgImageSelector() {
  const open = useModalStore(state => state.open)

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
        await deleteMutation.mutateAsync({})
      }
    })
  }, [])

  async function onSubmit(file: string | File) {
    try {
      const data = await forgeAPI.user.personalization.updateBgImage.mutate({
        file
      })

      setBgImage(forgeAPI.media.input(data).endpoint)
      toast.success('Background image updated')
    } catch {
      toast.error('Failed to update background image')
    }
  }

  const handleOpenImageSelector = useCallback(() => {
    open(FilePickerModal, {
      enableUrl: true,
      enablePixabay: true,
      acceptedMimeTypes: {
        image: ['png', 'jpg', 'jpeg', 'gif', 'webp']
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
          <>
            <Button
              className="w-1/2 md:w-auto"
              icon="tabler:adjustments"
              variant="plain"
              onClick={handleAdjustBgImage}
            >
              adjust
            </Button>
            <Button
              dangerous
              className="w-1/2 md:w-auto"
              icon="tabler:trash"
              variant="plain"
              onClick={handleDeleteBgImage}
            >
              remove
            </Button>
          </>
        ) : (
          <>
            <Button
              className="w-full md:w-auto"
              icon="tabler:photo-hexagon"
              variant="secondary"
              onClick={handleOpenImageSelector}
            >
              select
            </Button>
          </>
        )}
      </OptionsColumn>
    </>
  )
}

export default BgImageSelector
