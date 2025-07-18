import { Icon } from '@iconify/react'
import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone'
import { useTranslation } from 'react-i18next'

import { Button } from '@components/buttons'

function DnDContainer({
  getRootProps,
  getInputProps,
  isDragActive,
  setPreview,
  setFile
}: {
  getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps
  getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps
  isDragActive: boolean
  setPreview: (preview: string | null) => void
  setFile: (file: File | string | null) => void
}) {
  const { t } = useTranslation('common.misc')

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
      <input {...getInputProps()} multiple={false} type="file" />
      <Icon className="text-bg-500 size-20 shrink-0" icon="tabler:drag-drop" />
      <div className="text-bg-500 mt-4 text-center text-2xl font-medium">
        {isDragActive ? t('dnd.dropHere') : t('dnd.dragAndDropToUpload')}
      </div>
      <div className="text-bg-500 mt-4 text-center text-lg font-semibold uppercase tracking-widest">
        {t('dnd.or')}
      </div>
      <Button
        as="label"
        className="min-w-1/2 mt-4 cursor-pointer"
        icon="tabler:upload"
        variant="secondary"
      >
        upload
      </Button>
      <div className="text-bg-500 mt-4 text-center text-lg font-semibold uppercase tracking-widest">
        {t('dnd.or')}
      </div>
      <Button
        className="min-w-1/2 mt-2 cursor-pointer"
        icon="tabler:clipboard"
        namespace="common.misc"
        tKey="dnd"
        variant="secondary"
        onClick={pasteFromClipboard}
      >
        paste from clipboard
      </Button>
    </div>
  )
}

export default DnDContainer
