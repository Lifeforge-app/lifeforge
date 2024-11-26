import { Icon } from '@iconify/react/dist/iconify.js'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import ModalHeader from '@components/Modals/ModalHeader'
import ModalWrapper from '@components/Modals/ModalWrapper'
import ImageURL from './components/ImageURL'
import LocalUpload from './components/LocalUpload'
import Pixabay from './components/Pixabay'

const MODES = [
  ['Local', 'tabler:upload'],
  ['URL', 'tabler:link'],
  ['Pixabay', 'simple-icons:pixabay']
]

function ImageSelectorModal({
  isOpen,
  onClose,
  onSelect
}: {
  isOpen: boolean
  onClose: () => void
  onSelect: (url: string | File) => Promise<void>
}): React.ReactElement {
  const [file, setFile] = useState<File | string | null>(null)
  const [mode, setMode] = useState<'local' | 'url' | 'pixabay'>('local')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setFile(null)
      setMode('local')
    }
  }, [isOpen])

  return (
    <ModalWrapper
      isOpen={isOpen}
      minWidth="70vw"
      minHeight="90vh"
      className="overflow-hidden"
    >
      <ModalHeader
        icon="tabler:photo"
        title="Image Selector"
        onClose={onClose}
      />
      <div className="mb-6 flex items-center">
        {MODES.map(([name, icon], index) => (
          <button
            key={index}
            onClick={() => {
              setMode(name.toLowerCase() as 'local' | 'url' | 'pixabay')
              setFile(null)
            }}
            className={`flex w-full cursor-pointer items-center justify-center gap-2 border-b-2 p-4 uppercase tracking-widest transition-all ${
              mode === name.toLowerCase()
                ? 'border-custom-500 font-medium text-custom-500'
                : 'border-bg-400 text-bg-400 hover:border-bg-800 hover:text-bg-800 dark:border-bg-500 dark:text-bg-500 dark:hover:border-bg-200 dark:hover:text-bg-200'
            }`}
          >
            <Icon icon={icon} className="size-5" />
            {t(`imageUpload.${name.toLowerCase()}`)}
          </button>
        ))}
      </div>
      <div className="flex h-full min-h-0 flex-1 flex-col">
        {(() => {
          switch (mode) {
            case 'local':
              return <LocalUpload setFile={setFile} file={file} />
            case 'url':
              return <ImageURL setFile={setFile} file={file} />
            case 'pixabay':
              return <Pixabay setFile={setFile} file={file} />
          }
        })()}
      </div>
      <Button
        loading={loading}
        onClick={() => {
          setLoading(true)
          onSelect(file as string | File)
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
  )
}

export default ImageSelectorModal
