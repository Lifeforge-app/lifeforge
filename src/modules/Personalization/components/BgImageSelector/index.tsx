import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import ConfigColumn from '@components/utilities/ConfigColumn'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'
import APIRequest from '@utils/fetchData'
import AdjustBgImageModal from './components/AdjustBgImageModal'
import ImagePickerModal from '../../../../components/inputs/ImageAndFileInput/ImagePickerModal'

function BgImageSelector(): React.ReactElement {
  const { t } = useTranslation('modules.personalization')
  const { bgImage, setBgImage, setBackdropFilters } =
    usePersonalizationContext()
  const [imageSelectorModalOpen, setImageSelectorModalOpen] = useState(false)
  const [adjustBgImageModalOpen, setAdjustBgImageModalOpen] = useState(false)
  const [
    deleteBgImageConfirmationModalOpen,
    setDeleteBgImageConfirmationModalOpen
  ] = useState(false)

  async function onSubmit(url: string | File): Promise<void> {
    if (typeof url === 'string') {
      await APIRequest({
        endpoint: 'user/personalization/bg-image',
        method: 'PUT',
        body: { url },
        callback: data => {
          setBgImage(`${import.meta.env.VITE_API_HOST}/${data.data}`)
          toast.success('Background image updated')
        },
        onFailure: () => {
          toast.error('Failed to update background image')
        }
      })
    } else {
      const formData = new FormData()
      formData.append('file', url)
      await APIRequest({
        endpoint: 'user/personalization/bg-image',
        method: 'PUT',
        body: formData,
        isJSON: false,
        callback: data => {
          setBgImage(`${import.meta.env.VITE_API_HOST}/${data.data}`)
          toast.success('Background image updated')
        },
        onFailure: () => {
          toast.error('Failed to update background image')
        }
      })
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
              variant="no-bg"
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
              variant="no-bg"
              onClick={() => {
                setDeleteBgImageConfirmationModalOpen(true)
              }}
            >
              remove
            </Button>
          </>
        ) : (
          <Button
            className="w-full md:w-auto"
            icon="tabler:photo-hexagon"
            onClick={() => {
              setImageSelectorModalOpen(true)
            }}
          >
            select
          </Button>
        )}
      </ConfigColumn>
      <ImagePickerModal
        enablePixaBay
        enableUrl
        acceptedMimeTypes={{
          'image/*': ['png', 'jpg', 'jpeg', 'gif', 'webp']
        }}
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
