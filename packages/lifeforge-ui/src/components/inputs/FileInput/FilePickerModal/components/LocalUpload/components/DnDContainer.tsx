import { Button } from '@components/buttons'
import { Icon } from '@iconify/react'
import { useMemo } from 'react'
import type { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone'
import { useTranslation } from 'react-i18next'

function DnDContainer({
  getRootProps,
  getInputProps,
  isDragActive,
  setPreview,
  setFile,
  acceptedMimeTypes
}: {
  getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps
  getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps
  isDragActive: boolean
  setPreview: (preview: string | null) => void
  setFile: (file: File | string | null) => void
  acceptedMimeTypes: Record<string, string[]>
}) {
  const { t } = useTranslation('common.misc')

  const acceptedMimeTypesFlattened = useMemo(() => {
    return Object.entries(acceptedMimeTypes)
      .flatMap(([type, exts]) => exts.map(ext => `${type}/${ext}`))
      .join(', ')
  }, [acceptedMimeTypes])

  const pasteFromClipboard = async (e: React.MouseEvent) => {
    if (!navigator.clipboard) {
      console.error('Clipboard API not supported')

      return
    }

    e.preventDefault()
    e.stopPropagation()

    try {
      const clipboardItems = await navigator.clipboard.read()

      const items = Array.from(clipboardItems)

      const imageItem = items.find(item =>
        item.types.some(type => type.startsWith('image/'))
      )

      if (imageItem) {
        const blob = await imageItem.getType('image/png')

        const file = new File([blob], 'pasted-image.png', { type: 'image/png' })

        setFile(file)
        setPreview(URL.createObjectURL(file))
      }
    } catch (error) {
      console.error('Failed to paste from clipboard:', error)
    }
  }

  return (
    <div
      className="flex-center border-bg-500 size-full min-h-96 flex-1 flex-col rounded-lg border-[3px] border-dashed py-12"
      {...getRootProps()}
    >
      <input
        {...getInputProps()}
        accept={acceptedMimeTypesFlattened}
        multiple={false}
        type="file"
      />
      <Icon className="text-bg-500 size-20 shrink-0" icon="tabler:drag-drop" />
      <div className="text-bg-500 mt-4 text-center text-2xl font-medium">
        {isDragActive ? t('dnd.dropHere') : t('dnd.dragAndDropToUpload')}
      </div>
      <div className="text-bg-500 mt-4 text-center text-lg tracking-widest uppercase">
        {t('dnd.or')}
      </div>
      <Button
        className="mt-4 min-w-1/2 cursor-pointer"
        icon="tabler:clipboard"
        namespace="common.misc"
        variant="secondary"
        onClick={pasteFromClipboard}
      >
        dnd.buttons.pasteFromClipboard
      </Button>
      <p className="text-bg-500 mt-6 text-center text-sm">
        {t('fileInputSupportedFormat', {
          format: acceptedMimeTypesFlattened || 'N/A'
        })}
      </p>
    </div>
  )
}

export default DnDContainer
