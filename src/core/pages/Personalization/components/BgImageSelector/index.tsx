import { usePersonalization } from '@providers/PersonalizationProvider'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import {
  Button,
  ConfigColumn,
  DeleteConfirmationModal,
  ImagePickerModal,
  Tooltip
} from '@lifeforge/ui'

import useAPIQuery from '@hooks/useAPIQuery'

import fetchAPI from '@utils/fetchAPI'

import AdjustBgImageModal from './components/AdjustBgImageModal'

function BgImageSelector() {
  const { t } = useTranslation('core.personalization')
  const pixabayEnabledQuery = useAPIQuery<boolean>('/pixabay/key-exists', [
    'pixabay',
    'key-exists'
  ])
  const { bgImage, setBgImage, setBackdropFilters } = usePersonalization()
  const [imageSelectorModalOpen, setImageSelectorModalOpen] = useState(false)
  const [adjustBgImageModalOpen, setAdjustBgImageModalOpen] = useState(false)
  const [
    deleteBgImageConfirmationModalOpen,
    setDeleteBgImageConfirmationModalOpen
  ] = useState(false)
  const imageGenAPIKeyExistsQuery = useAPIQuery<boolean>(
    'ai/image-generation/key-exists',
    ['ai', 'image-generation', 'key-exists']
  )

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
    } finally {
      setImageSelectorModalOpen(false)
    }
  }

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
              onClick={() => {
                setAdjustBgImageModalOpen(true)
              }}
            >
              adjust
            </Button>
            <Button
              isRed
              className="w-1/2 md:w-auto"
              icon="tabler:trash"
              variant="plain"
              onClick={() => {
                setDeleteBgImageConfirmationModalOpen(true)
              }}
            >
              remove
            </Button>
          </>
        ) : (
          <>
            <Button
              className="w-full md:w-auto"
              icon="tabler:photo-hexagon"
              onClick={() => {
                setImageSelectorModalOpen(true)
              }}
            >
              select
            </Button>
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
          </>
        )}
      </ConfigColumn>
      <ImagePickerModal
        enableUrl
        acceptedMimeTypes={{
          'image/*': ['png', 'jpg', 'jpeg', 'gif', 'webp']
        }}
        enableAI={imageGenAPIKeyExistsQuery.data ?? false}
        enablePixabay={pixabayEnabledQuery.data ?? false}
        isOpen={imageSelectorModalOpen}
        onClose={() => {
          setImageSelectorModalOpen(false)
        }}
        onSelect={onSubmit}
      />
      <AdjustBgImageModal
        isOpen={adjustBgImageModalOpen}
        onClose={() => {
          setAdjustBgImageModalOpen(false)
        }}
      />
      <DeleteConfirmationModal
        apiEndpoint="user/personalization/bg-image"
        customCallback={async () => {
          setBgImage('')
          setBackdropFilters({
            brightness: 100,
            blur: 'none',
            contrast: 100,
            saturation: 100,
            overlayOpacity: 50
          })
        }}
        customText="Deleting the background image will revert the system appearance to plain colors. Are you sure you want to proceed?"
        isOpen={deleteBgImageConfirmationModalOpen}
        itemName="background image"
        onClose={() => {
          setDeleteBgImageConfirmationModalOpen(false)
        }}
      />
    </>
  )
}

export default BgImageSelector
