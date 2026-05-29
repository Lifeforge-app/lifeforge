import clsx from 'clsx'
import { useMemo } from 'react'
import type { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/inputs'
import { Icon } from '@/components/primitives'
import { Flex, Text } from '@/components/primitives'

import * as styles from './DnDContainer.css'

export function DnDContainer({
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

        const file = new File([blob], 'pasted-image.png', {
          type: 'image/png'
        })

        setFile(file)
        setPreview(URL.createObjectURL(file))
      }
    } catch (error) {
      console.error('Failed to paste from clipboard:', error)
    }
  }

  return (
    <Flex
      align="center"
      className={clsx(
        styles.dndWrapper,
        isDragActive ? styles.dndWrapperActive : styles.dndWrapperInactive
      )}
      direction="column"
      height="100%"
      justify="center"
      p="2xl"
      r="lg"
      style={{ flex: 1, minHeight: '24rem' }}
      width="100%"
      {...(getRootProps() as any)}
    >
      <input
        {...(getInputProps() as any)}
        accept={acceptedMimeTypesFlattened}
        multiple={false}
        type="file"
      />
      <Text
        asChild
        color="muted"
        style={{ height: '5rem', width: '5rem', flexShrink: 0 }}
      >
        <Icon icon="tabler:drag-drop" />
      </Text>
      <Text
        align="center"
        as="div"
        color="muted"
        mt="md"
        size="2xl"
        weight="medium"
      >
        {isDragActive ? t('dnd.dropHere') : t('dnd.dragAndDropToUpload')}
      </Text>
      <Text
        align="center"
        as="div"
        color="muted"
        mt="md"
        size="lg"
        style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}
      >
        {t('dnd.or')}
      </Text>
      <Button
        icon="tabler:clipboard"
        namespace="common.misc"
        style={{ marginTop: '1rem', minWidth: '50%', cursor: 'pointer' }}
        variant="secondary"
        onClick={pasteFromClipboard}
      >
        dnd.buttons.pasteFromClipboard
      </Button>
      <Text align="center" as="p" color="muted" mt="lg" size="sm">
        {t('fileInputSupportedFormat', {
          format: acceptedMimeTypesFlattened || 'N/A'
        })}
      </Text>
    </Flex>
  )
}
