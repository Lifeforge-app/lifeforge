import { usePersonalization } from '@providers/PersonalizationProvider'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import {
  Button,
  ConfigColumn,
  DeleteConfirmationModal,
  FileAndImagePickerModal,
  QueryWrapper,
  Tooltip
} from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import useAPIQuery from '@hooks/useAPIQuery'

import fetchAPI from '@utils/fetchAPI'

import AdjustBgImageModal from './modals/AdjustBgImageModal'

function BgImageSelector() {
  const open = useModalStore(state => state.open)
  const { t } = useTranslation('core.personalization')
  const pixabayEnabledQuery = useAPIQuery<boolean>('/pixabay/key-exists', [
    'pixabay',
    'key-exists'
  ])
  const { bgImage, setBgImage, setBackdropFilters } = usePersonalization()
  const imageGenAPIKeyExistsQuery = useAPIQuery<boolean>(
    'ai/image-generation/key-exists',
    ['ai', 'image-generation', 'key-exists']
  )

  const handleAdjustBgImage = useCallback(() => {
    open(AdjustBgImageModal, {})
  }, [])

  const handleDeleteBgImage = useCallback(() => {
    open(DeleteConfirmationModal, {
      apiEndpoint: 'user/personalization/bg-image',
      customCallback: async () => {
        setBgImage('')
        setBackdropFilters({
          brightness: 100,
          blur: 'none',
          contrast: 100,
          saturation: 100,
          overlayOpacity: 50
        })
      },
      customText:
        'Deleting the background image will revert the system appearance to plain colors. Are you sure you want to proceed?',
      itemName: 'background image'
    })
  }, [])

  async function onSubmit(url: string | File) {
    try {
      const data = await fetchAPI<string>('user/personalization/bg-image', {
        method: 'PUT',
        body:
          typeof url === 'string'
            ? { url }
            : (() => {
                const formData = new FormData()
                formData.append('file', url)
                return formData
              })()
      })

      setBgImage(`${import.meta.env.VITE_API_HOST}/${data}`)
      toast.success('Background image updated')
    } catch {
      toast.error('Failed to update background image')
    }
  }

  const handleOpenImageSelector = useCallback(() => {
    open(FileAndImagePickerModal, {
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
              isRed
              className="w-1/2 md:w-auto"
              icon="tabler:trash"
              variant="plain"
              onClick={handleDeleteBgImage}
            >
              remove
            </Button>
          </>
        ) : (
          <QueryWrapper query={pixabayEnabledQuery}>
            {pixabayEnabled => (
              <>
                <Button
                  className="w-full md:w-auto"
                  icon="tabler:photo-hexagon"
                  onClick={handleOpenImageSelector}
                >
                  select
                </Button>
                {!pixabayEnabled && (
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
          </QueryWrapper>
        )}
      </ConfigColumn>
    </>
  )
}

export default BgImageSelector
