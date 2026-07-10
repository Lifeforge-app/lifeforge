import { useMemo } from 'react'
import type { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/inputs'
import { Bordered, Flex, Icon, Text, Transition } from '@/components/primitives'
import { colorWithOpacity } from '@/system'

import { useFilePicker } from '../../../contexts/FilePickerContext'

export function DnDContainer({
  getRootProps,
  getInputProps,
  isDragActive
}: {
  getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps
  getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps
  isDragActive: boolean
}) {
  const { t } = useTranslation('common.misc')
  const { acceptedMimeTypes, setFile, setPreview } = useFilePicker()

  const acceptedMimeTypesFlattened = useMemo(() => {
    return Object.entries(acceptedMimeTypes ?? {})
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
    <Transition>
      <Bordered
        asChild
        borderColor={isDragActive ? 'custom-500' : 'bg-500'}
        borderStyle={isDragActive ? 'solid' : 'dashed'}
        borderWidth="3px"
      >
        <Flex
          align="center"
          bg={isDragActive ? colorWithOpacity('custom-500', '5%') : undefined}
          direction="column"
          flex="1"
          height="100%"
          justify="center"
          minHeight="24em"
          p="2xl"
          r="lg"
          width="100%"
          {...getRootProps()}
          style={{
            cursor: 'pointer',
            ...getRootProps().style
          }}
        >
          <input
            {...getInputProps()}
            accept={acceptedMimeTypesFlattened}
            multiple={false}
            type="file"
          />
          <Icon color="muted" icon="tabler:drag-drop" size="5em" />
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
      </Bordered>
    </Transition>
  )
}
