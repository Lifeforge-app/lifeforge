import { t } from 'i18next'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import ConfigColumn from '@components/Miscellaneous/ConfigColumn'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'
import APIRequest from '@utils/fetchData'
import AdjustBgImageModal from './components/AdjustBgImageModal'
import ImageSelectorModal from './components/ImageSelectorModal'

function BgImageSelector(): React.ReactElement {
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
          setBgImage(data.data)
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
          console.log(data)
          setBgImage(data.data)
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
        title={t('personalization.bgImageSelector.title')}
        desc={t('personalization.bgImageSelector.desc')}
        icon="tabler:photo"
      >
        {bgImage !== '' ? (
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setAdjustBgImageModalOpen(true)
              }}
              icon="tabler:adjustments"
              variant="no-bg"
            >
              adjust
            </Button>
            <Button
              onClick={() => {
                setDeleteBgImageConfirmationModalOpen(true)
              }}
              icon="tabler:trash"
              variant="no-bg"
              isRed
            >
              remove
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => {
              setImageSelectorModalOpen(true)
            }}
            className="mt-4"
            icon="tabler:photo-hexagon"
          >
            select
          </Button>
        )}
      </ConfigColumn>
      <ImageSelectorModal
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
        isOpen={deleteBgImageConfirmationModalOpen}
        onClose={() => {
          setDeleteBgImageConfirmationModalOpen(false)
        }}
        apiEndpoint="user/personalization/bg-image"
        customText="Deleting the background image will revert the system appearance to plain colors. Are you sure you want to proceed?"
        itemName="background image"
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
      />
    </>
  )
}

export default BgImageSelector
