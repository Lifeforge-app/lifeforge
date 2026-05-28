import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Zoom from 'react-medium-image-zoom'

import { Button } from '@components/inputs'
import { useModalStore } from 'shared'
import { Box, Flex, Text } from '@components/primitives'

import { useInputLabel } from '../shared/hooks/useInputLabel'
import * as styles from './FileInput.css'
import { FilePickerModal } from './FilePickerModal'
import { FILE_ICONS } from './FilePickerModal/constants/file_icons'

export type FileData = {
  file: string | File | null
  preview: string | null
}

export function FileInput({
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
  acceptedMimeTypes?: Record<string, string[]>
}) {
  const { open } = useModalStore()

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
    <Flex
      shadow
      className={clsx('__file-input', styles.wrapper)}
      direction="column"
      p="lg"
      rounded="md"
      style={{
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto'
      }}
      width="100%"
    >
      <Text asChild color="bg-500">
        <Flex align="center" gap="sm">
          <Icon icon={icon} style={{ height: '1.5rem', width: '1.5rem' }} />
          <Text as="span" color="inherit" weight="medium">
            {inputLabel}{' '}
            {required === true && (
              <Text as="span" color="dangerous">
                *
              </Text>
            )}
          </Text>
        </Flex>
      </Text>
      {!file || file === 'removed' ? (
        <>
          <Box asChild my="md">
            <Button
              icon="tabler:file-plus"
              style={{ width: '100%' }}
              variant="secondary"
              onClick={handleFilePickerOpen}
            >
              Select
            </Button>
          </Box>
          <Text align="center" as="p" color="bg-500" size="sm">
            {reminderText ||
              t('fileInputSupportedFormat', {
                format: acceptedMimeTypes
                  ? Object.entries(acceptedMimeTypes)
                      .flatMap(([type, exts]) =>
                        exts.map(ext => `${type}/${ext}`)
                      )
                      .join(', ') || 'N/A'
                  : 'N/A'
              })}
          </Text>
        </>
      ) : (
        <>
          {preview &&
          (preview.startsWith('http') ||
            preview.startsWith('blob:') ||
            preview.startsWith('data:')) ? (
            <Box mt="lg">
              <Zoom zoomMargin={100}>
                <Box asChild maxHeight="24rem" rounded="md">
                  <img alt="" src={preview} />
                </Box>
              </Zoom>
              <Button
                dangerous
                icon="tabler:x"
                style={{ marginTop: '1.5rem', width: '100%' }}
                onClick={() => {
                  setData({ file: null, preview: null })
                  onImageRemoved?.()
                }}
              >
                Remove
              </Button>
            </Box>
          ) : (
            <Flex align="center" gap="xl" justify="between" mt="md">
              <Flex align="center" gap="sm" minWidth="0">
                <Box asChild flexShrink="0">
                  <Text asChild color="bg-500">
                    <Icon
                      icon={
                        FILE_ICONS[
                          (file instanceof File
                            ? file.name.split('.').pop()
                            : '') as keyof typeof FILE_ICONS
                        ] || 'tabler:file'
                      }
                      style={{ height: '1.5rem', width: '1.5rem' }}
                    />
                  </Text>
                </Box>
                <Text truncate as="p">
                  {file instanceof File ? file.name : file}
                </Text>
              </Flex>
              <Button
                icon="tabler:x"
                p="sm"
                variant="plain"
                onClick={() => {
                  setData({ file: null, preview: null })
                  onImageRemoved?.()
                }}
              />
            </Flex>
          )}
        </>
      )}
    </Flex>
  )
}

