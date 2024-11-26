import { Icon } from '@iconify/react/dist/iconify.js'
import { t } from 'i18next'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import ConfigColumn from '@components/Miscellaneous/ConfigColumn'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'
import APIRequest from '@utils/fetchData'
import ImageSelectorModal from './components/ImageSelectorModal'

function BgImageSelector(): React.ReactElement {
  const { bgImage, setBgImage } = usePersonalizationContext()
  const [imageSelectorModalOpen, setImageSelectorModalOpen] = useState(false)
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
          <div className="relative overflow-hidden rounded-lg border-2 border-bg-50 shadow-custom dark:border-bg-800/50">
            <img src={bgImage} alt="" className="h-32 object-contain" />
            <button
              onClick={() => {
                setDeleteBgImageConfirmationModalOpen(true)
              }}
              className="absolute right-0 top-0 flex size-full items-center justify-center rounded-lg bg-red-500/30 opacity-0 transition-all hover:opacity-100"
            >
              <Icon icon="tabler:trash" className="size-6 text-red-500" />
            </button>
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
      <DeleteConfirmationModal
        isOpen={deleteBgImageConfirmationModalOpen}
        onClose={() => {
          setDeleteBgImageConfirmationModalOpen(false)
        }}
        apiEndpoint="user/personalization/bg-image"
        customText="Are you sure you want to remove the background image? This action cannot be undone."
        itemName="background image"
        customCallback={async () => {
          setBgImage('')
        }}
      />
    </>
  )
}

export default BgImageSelector
