import { useCallback } from 'react'
import { z } from 'zod'

import { Flex, Icon, Text } from '@/components/primitives'
import { useModalStore } from '@/providers'
import { colorWithOpacity } from '@/system'

import { useInputLabel } from '../shared/hooks/useInputLabel'
import { FilePickerModal } from './FilePickerModal'
import { CompactFileDisplay } from './components/CompactFileDisplay'
import { EmptyFileInput } from './components/EmptyFileInput'
import { PreviewFileDisplay } from './components/PreviewFileDisplay'

export type FileValue =
  | {
      type: 'empty'
    }
  | {
      type: 'existing'
      id: string
      filename: string
      preview?: string
    }
  | {
      type: 'upload'
      file: File
      preview?: string
    }
  | {
      type: 'url'
      url: string
      preview?: string
    }

export const fileValueSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('empty')
  }),
  z.object({
    type: z.literal('existing'),
    id: z.string(),
    filename: z.string(),
    preview: z.string().optional()
  }),
  z.object({
    type: z.literal('upload'),
    file: z.instanceof(File),
    preview: z.string().optional()
  }),
  z.object({
    type: z.literal('url'),
    url: z.string(),
    preview: z.string().optional()
  })
])

export interface FilePickerSourceConfig {
  pixabay?: boolean
  url?: boolean
  ai?:
    | {
        defaultPrompt: string
      }
    | false
}

export function FileInput({
  icon,
  label,
  reminderText,
  value,
  onChange,
  onImageRemoved,
  required,
  namespace,
  disabled,
  sources = {
    pixabay: false,
    ai: false,
    url: false
  },
  mimeTypes,
  errorMsg
}: {
  icon: string
  label: string
  reminderText?: string
  value: FileValue
  onChange: (value: FileValue) => void
  onImageRemoved?: () => void
  required?: boolean
  namespace?: string
  disabled?: boolean
  sources?: FilePickerSourceConfig
  mimeTypes?: Record<string, string[]>
  errorMsg?: string
}) {
  const { open } = useModalStore()

  const inputLabel = useInputLabel({ namespace, label })

  const handleFilePickerOpen = useCallback(
    function () {
      open(FilePickerModal, {
        sources,
        mimeTypes,
        onSelect: async function (file: string | File, preview: string | null) {
          if (file instanceof File) {
            onChange({
              type: 'upload',
              file,
              preview: preview ?? undefined
            })
          } else {
            onChange({
              type: 'url',
              url: file,
              preview: preview ?? undefined
            })
          }
        }
      })
    },
    [sources, mimeTypes, onChange]
  )

  const previewUrl = value.type !== 'empty' ? value.preview : undefined

  return (
    <Flex direction="column" gap="sm" width="100%">
      <Flex
        shadow
        bg={{
          base: colorWithOpacity('bg-200', '50%'),
          dark: colorWithOpacity('bg-800', '70%')
        }}
        className="__file-input"
        direction="column"
        p="lg"
        r="md"
        style={{
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? 'none' : 'auto',
          outline: errorMsg ? '2px solid var(--color-dangerous)' : undefined
        }}
        width="100%"
      >
        <Text asChild color={errorMsg ? 'dangerous' : 'muted'}>
          <Flex align="center" gap="sm">
            <Icon icon={icon} size="1.5rem" />
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
        {value.type === 'empty' ? (
          <EmptyFileInput
            acceptedMimeTypes={mimeTypes}
            reminderText={reminderText}
            onSelect={handleFilePickerOpen}
          />
        ) : (
          <>
            {previewUrl &&
            (previewUrl.startsWith('http') ||
              previewUrl.startsWith('blob:') ||
              previewUrl.startsWith('data:')) ? (
              <PreviewFileDisplay
                previewUrl={previewUrl}
                onChange={onChange}
                onImageRemoved={onImageRemoved}
              />
            ) : (
              <CompactFileDisplay
                value={value}
                onChange={onChange}
                onImageRemoved={onImageRemoved}
              />
            )}
          </>
        )}
      </Flex>
      {errorMsg && (
        <Text color="dangerous" display="block" px="md" size="sm">
          {errorMsg}
        </Text>
      )}
    </Flex>
  )
}
