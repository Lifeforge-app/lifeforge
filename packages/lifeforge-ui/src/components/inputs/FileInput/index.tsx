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

function FileInput({
  darker = true,
  icon,
  name,
  reminderText,
  image,
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
  darker?: boolean
  icon: string
  name: string
  reminderText?: string
  image: string | File | null
  preview: string | null
  setData: (data: {
    file: string | File | null
    preview: string | null
  }) => void
  onImageRemoved?: () => void
  required?: boolean
  namespace: string
  disabled?: boolean
  enablePixabay?: boolean
  enableUrl?: boolean
  enableAI?: boolean
  defaultAIPrompt?: string
  acceptedMimeTypes: Record<string, string[]>
}) {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation([namespace, 'common.buttons'])

  const inputLabel = useInputLabel(namespace, name)

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
        'bg-bg-200/50 shadow-custom flex w-full flex-col rounded-md p-6',
        darker ? 'component-bg-lighter' : 'component-bg',
        disabled ? 'pointer-events-none! opacity-50' : 'cursor-pointer'
      )}
    >
      <div className="text-bg-500 flex items-center gap-3">
        <Icon className="size-6" icon={icon} />
        <span className="font-medium">
          {inputLabel}{' '}
          {required === true && <span className="text-red-500">*</span>}
        </span>
      </div>
      {preview !== null && (
        <>
          <Zoom zoomMargin={100}>
            <img
              alt=""
              className="mx-auto mt-6 max-h-64 rounded-md"
              src={preview}
            />
          </Zoom>
          <Button
            isRed
            className="mt-6 w-full"
            icon="tabler:x"
            onClick={() => {
              setData({ file: null, preview: null })
              onImageRemoved?.()
            }}
          >
            Remove
          </Button>
        </>
      )}
      {image !== null && image !== 'removed' && preview === null && (
        <div className="mt-4 flex items-center justify-between gap-8">
          <div className="flex w-full items-center gap-3">
            <Icon
              className="text-bg-500 size-6"
              icon={
                FILE_ICONS[
                  ((image as File).name.split('.').pop() ||
                    '') as keyof typeof FILE_ICONS
                ] || 'tabler:file'
              }
            />
            <p className="w-full truncate">{(image as File).name}</p>
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
      {(image === null || image === 'removed') && (
        <div className="mt-6 flex flex-col items-center gap-3">
          <Button
            className="w-full"
            icon="tabler:file-plus"
            variant="secondary"
            onClick={handleFilePickerOpen}
          >
            {t('common.buttons:select')}
          </Button>
          <p className="text-bg-500 text-xs">{reminderText}</p>
        </div>
      )}
    </div>
  )
}

export default FileInput
