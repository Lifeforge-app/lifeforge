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
  const { t } = useTranslation('common.modals')
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
      <ModalWrapper className="overflow-hidden" isOpen={isOpen} minWidth="70vw">
        <ModalHeader
          icon="tabler:photo"
          title="imagePicker.title"
          onClose={onClose}
        />
        {(enablePixaBay || enableUrl) && (
          <Tabs
            active={mode}
            enabled={(['local', 'url', 'pixabay'] as const).filter(
              name =>
                (name === 'pixabay' && enablePixaBay) ||
                (name === 'url' && enableUrl)
            )}
            items={[
              {
                name: t('imagePicker.pixabay'),
                icon: 'tabler:upload',
                id: 'local'
              },
              {
                name: t('imagePicker.url'),
                icon: 'tabler:link',
                id: 'url'
              },
              {
                name: t('imagePicker.pixabay'),
                icon: 'simple-icons:pixabay',
                id: 'pixabay'
              }
            ]}
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
                    acceptedMimeTypes={acceptedMimeTypes}
                    file={file}
                    preview={preview}
                    setFile={setFile}
                    setPreview={setPreview}
                  />
                )
              case 'url':
                return (
                  <ImageURL
                    file={file}
                    setFile={setFile}
                    setPreview={setPreview}
                  />
                )
              case 'pixabay':
                return (
                  <Pixabay
                    file={file}
                    filters={filters}
                    setFile={setFile}
                    setIsSearchFilterModalOpen={setIsSearchFilterModalOpen}
                    setPreview={setPreview}
                  />
                )
            }
          })()}
        </div>
        <Button
          className="mt-4"
          disabled={file === null}
          icon="tabler:check"
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
        >
          select
        </Button>
      </ModalWrapper>
      <SearchFilterModal
        filters={filters}
        isOpen={isSearchFilterModalOpen}
        updateFilters={updateFilters}
        onClose={() => {
          setIsSearchFilterModalOpen(false)
        }}
      />
    </>
  )
}

export default ImagePickerModal
