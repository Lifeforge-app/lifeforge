import { Icon } from '@iconify/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  Button,
  ConfigColumn,
  ConfirmationModal,
  FilePickerModal,
  Tooltip
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { usePersonalization } from 'shared'

import AdjustBgImageModal from './modals/AdjustBgImageModal'

function BgImageSelector() {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('core.personalization')

  const pixabayEnabledQuery = useQuery(
    forgeAPI.pixabay.verifyAPIKey.queryOptions()
  )

  const imageGenAPIKeyExistsQuery = useQuery(
    forgeAPI.ai.imageGeneration.verifyAPIKey.queryOptions()
  )

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
      buttonType: 'delete',
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
      acceptedMimeTypes: {
        'image/*': ['png', 'jpg', 'jpeg', 'gif', 'webp']
      },
      enableAI: imageGenAPIKeyExistsQuery.data ?? false,
      enablePixabay: pixabayEnabledQuery.data ?? false,
      onSelect: onSubmit
    })
  }, [imageGenAPIKeyExistsQuery.data, pixabayEnabledQuery.data])

  return (
    <>
      <ConfigColumn
        desc={t('bgImageSelector.desc')}
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
        ) : pixabayEnabledQuery.isLoading ? (
          <Icon className="text-bg-500 size-6" icon="svg-spinners:180-ring" />
        ) : (
          <>
            <Button
              className="w-full md:w-auto"
              icon="tabler:photo-hexagon"
              onClick={handleOpenImageSelector}
            >
              select
            </Button>
            {!pixabayEnabledQuery.data && (
              <Tooltip
                icon="tabler:info-circle"
                id="pixabayDisabled"
                tooltipProps={{
                  clickable: true
                }}
              >
                <p className="text-bg-500 max-w-84">
                  {t('bgImageSelector.pixabayDisabled.tooltip')}{' '}
                  <a
                    className="text-custom-500 decoration-custom-500 font-medium underline decoration-2"
                    href="https://docs.lifeforge.melvinchia.dev/user-guide/personalization#pixabay"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Customization Guide
                  </a>
                </p>
              </Tooltip>
            )}
          </>
        )}
      </ConfigColumn>
    </>
  )
}

export default BgImageSelector
