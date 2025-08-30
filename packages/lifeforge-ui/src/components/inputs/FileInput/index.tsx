import { Button } from '@components/buttons'
import { useModalStore } from '@components/modals'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Zoom from 'react-medium-image-zoom'

import useInputLabel from '../shared/hooks/useInputLabel'
import FilePickerModal from './FilePickerModal'
import FILE_ICONS from './FilePickerModal/constants/file_icons'

export type FileData = {
  file: string | File | null
  preview: string | null
}

function FileInput({
  icon,
  label,
  reminderText,
  file,
  preview,
  setData,
  onImageRemoved,
  required,
  namespace,
  disabled,
  enablePixabay = false,
  enableUrl = false,
  enableAI = false,
  defaultAIPrompt = '',
  acceptedMimeTypes
}: {
  icon: string
  label: string
  reminderText?: string
  file: string | File | null
  preview: string | null
  setData: (data: {
    file: string | File | null
    preview: string | null
  }) => void
  onImageRemoved?: () => void
  required?: boolean
  namespace?: string
  disabled?: boolean
  enablePixabay?: boolean
  enableUrl?: boolean
  enableAI?: boolean
  defaultAIPrompt?: string
  acceptedMimeTypes: Record<string, string[]>
}) {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('common.misc')

  const inputLabel = useInputLabel({ namespace, label })

  const handleFilePickerOpen = useCallback(() => {
    open(FilePickerModal, {
      enablePixabay,
      enableUrl,
      enableAI,
      defaultAIPrompt,
      acceptedMimeTypes,
      onSelect: async (file: string | File, preview: string | null) => {
        setData({ file, preview })
      }
    })
  }, [enablePixabay, enableUrl, enableAI, defaultAIPrompt, acceptedMimeTypes])

  return (
    <div
      className={clsx(
        'bg-bg-200/50 __file-input shadow-custom component-bg-lighter flex w-full flex-col rounded-md p-6',
        disabled ? 'pointer-events-none! opacity-50' : 'cursor-pointer'
      )}
    >
      <div className="text-bg-500 flex w-full items-center gap-3">
        <Icon className="size-6" icon={icon} />
        <span className="font-medium">
          {inputLabel}{' '}
          {required === true && <span className="text-red-500">*</span>}
        </span>
      </div>
      {!file || file === 'removed' ? (
        <div className="mt-6 flex w-full flex-col items-center gap-3">
          <Button
            className="w-full"
            icon="tabler:file-plus"
            variant="secondary"
            onClick={handleFilePickerOpen}
          >
            Select
          </Button>
          <p className="text-bg-500 text-center text-sm">
            {reminderText ||
              t('fileInputSupportedFormat', {
                format:
                  Object.entries(acceptedMimeTypes)
                    .flatMap(([type, exts]) =>
                      exts.map(ext => `${type}/${ext}`)
                    )
                    .join(', ') || 'N/A'
              })}
          </p>
        </div>
      ) : (
        <>
          {preview ? (
            <div className="mt-6">
              <Zoom zoomMargin={100}>
                <img alt="" className="max-h-96 rounded-md" src={preview} />
              </Zoom>
              <Button
                dangerous
                className="mt-6 w-full"
                icon="tabler:x"
                onClick={() => {
                  setData({ file: null, preview: null })
                  onImageRemoved?.()
                }}
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-between gap-8">
              <div className="flex w-full items-center gap-3">
                <Icon
                  className="text-bg-500 size-6"
                  icon={
                    FILE_ICONS[
                      (file instanceof File
                        ? file.name.split('.').pop()
                        : '') as keyof typeof FILE_ICONS
                    ] || 'tabler:file'
                  }
                />
                <p className="w-full truncate">
                  {file instanceof File ? file.name : file}
                </p>
              </div>
              <Button
                className="p-2!"
                icon="tabler:x"
                variant="plain"
                onClick={() => {
                  setData({ file: null, preview: null })
                  onImageRemoved?.()
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default FileInput
