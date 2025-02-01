import React, { useEffect, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@components/buttons'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import Tabs from '@components/utilities/Tabs'
import {
  type IPixabaySearchFilter,
  type PixabaySearchFilterAction
} from '@interfaces/pixabay_interfaces'
import ImageURL from './components/ImageURL'
import LocalUpload from './components/LocalUpload'
import Pixabay from './components/Pixabay'
import SearchFilterModal from './components/Pixabay/components/SearchFilterModal'

const initialFilter: IPixabaySearchFilter = {
  imageType: 'all',
  category: '',
  colors: '',
  isEditorsChoice: false
}

function reducer(
  state: IPixabaySearchFilter,
  action: PixabaySearchFilterAction
): typeof initialFilter {
  switch (action.type) {
    case 'SET_IMAGE_TYPE':
      return { ...state, imageType: action.payload }
    case 'SET_CATEGORY':
      return { ...state, category: action.payload }
    case 'SET_COLORS':
      return { ...state, colors: action.payload }
    case 'SET_IS_EDITORS_CHOICE':
      return { ...state, isEditorsChoice: action.payload }
    default:
      return state
  }
}

function ImagePickerModal({
  isOpen,
  onClose,
  enablePixaBay = false,
  enableUrl = false,
  acceptedMimeTypes,
  onSelect
}: {
  isOpen: boolean
  onClose: () => void
  enablePixaBay?: boolean
  enableUrl?: boolean
  acceptedMimeTypes: Record<string, string[]>
  onSelect: (file: string | File, preview: string | null) => Promise<void>
}): React.ReactElement {
  const { t } = useTranslation('common.misc')
  const [file, setFile] = useState<File | string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [mode, setMode] = useState<'local' | 'url' | 'pixabay'>('local')
  const [loading, setLoading] = useState(false)

  const [isSearchFilterModalOpen, setIsSearchFilterModalOpen] = useState(false)
  const [filters, updateFilters] = useReducer(reducer, initialFilter)

  useEffect(() => {
    if (!isOpen) {
      setFile(null)
      setMode('local')
    }
  }, [isOpen])

  return (
    <>
      <ModalWrapper isOpen={isOpen} minWidth="70vw" className="overflow-hidden">
        <ModalHeader
          icon="tabler:photo"
          title="Image Selector"
          onClose={onClose}
        />
        {(enablePixaBay || enableUrl) && (
          <Tabs
            items={[
              {
                name: t('imageUpload.pixabay'),
                icon: 'tabler:upload',
                id: 'local'
              },
              {
                name: t('imageUpload.url'),
                icon: 'tabler:link',
                id: 'url'
              },
              {
                name: t('imageUpload.pixabay'),
                icon: 'simple-icons:pixabay',
                id: 'pixabay'
              }
            ]}
            enabled={(['local', 'url', 'pixabay'] as const).filter(
              name =>
                (name === 'pixabay' && enablePixaBay) ||
                (name === 'url' && enableUrl)
            )}
            active={mode}
            onNavClick={(id: 'local' | 'url' | 'pixabay') => {
              setMode(id)
              setFile(null)
            }}
          />
        )}
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-auto">
          {(() => {
            switch (mode) {
              case 'local':
                return (
                  <LocalUpload
                    setFile={setFile}
                    file={file}
                    preview={preview}
                    setPreview={setPreview}
                    acceptedMimeTypes={acceptedMimeTypes}
                  />
                )
              case 'url':
                return (
                  <ImageURL
                    setFile={setFile}
                    file={file}
                    setPreview={setPreview}
                  />
                )
              case 'pixabay':
                return (
                  <Pixabay
                    setFile={setFile}
                    file={file}
                    setPreview={setPreview}
                    filters={filters}
                    setIsSearchFilterModalOpen={setIsSearchFilterModalOpen}
                  />
                )
            }
          })()}
        </div>
        <Button
          loading={loading}
          onClick={() => {
            setLoading(true)
            onSelect(file as string | File, preview)
              .catch(console.error)
              .finally(() => {
                setLoading(false)
                onClose()
              })
          }}
          disabled={file === null}
          className="mt-4"
          icon="tabler:check"
        >
          select
        </Button>
      </ModalWrapper>
      <SearchFilterModal
        isOpen={isSearchFilterModalOpen}
        onClose={() => {
          setIsSearchFilterModalOpen(false)
        }}
        filters={filters}
        updateFilters={updateFilters}
      />
    </>
  )
}

export default ImagePickerModal
