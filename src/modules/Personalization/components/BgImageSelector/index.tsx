import { usePersonalization } from '@providers/PersonalizationProvider'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import {
  Button,
  ConfigColumn,
  DeleteConfirmationModal,
  ImagePickerModal
} from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

import AdjustBgImageModal from './components/AdjustBgImageModal'

function BgImageSelector(): React.ReactElement {
  const { t } = useTranslation('modules.personalization')
  const { bgImage, setBgImage, setBackdropFilters } = usePersonalization()
  const [imageSelectorModalOpen, setImageSelectorModalOpen] = useState(false)
  const [adjustBgImageModalOpen, setAdjustBgImageModalOpen] = useState(false)
  const [
    deleteBgImageConfirmationModalOpen,
    setDeleteBgImageConfirmationModalOpen
  ] = useState(false)

  async function onSubmit(url: string | File): Promise<void> {
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
