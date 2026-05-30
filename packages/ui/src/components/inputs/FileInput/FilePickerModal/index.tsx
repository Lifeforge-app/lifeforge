import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { usePromiseLoading } from '@lifeforge/shared'

import { Button } from '@/components/inputs'
import { Tabs } from '@/components/navigation'
import { ModalHeader } from '@/components/overlays'
import { Box, Flex } from '@/components/primitives'

import { AIImageGenerator } from './components/AIImageGenerator'
import { ImageURL } from './components/ImageURL'
import { LocalUpload } from './components/LocalUpload'
import { Pixabay } from './components/Pixabay'

export function FilePickerModal({
  data: {
    enablePixabay = false,
    enableUrl = false,
    enableAI = false,
    defaultAIPrompt = '',
    acceptedMimeTypes,
    onSelect
  },
  onClose
}: {
  data: {
    enablePixabay?: boolean
    enableUrl?: boolean
    enableAI?: boolean
    defaultAIPrompt?: string
    acceptedMimeTypes?: Record<string, string[]>
    onSelect: (file: string | File, preview: string | null) => Promise<void>
  }
  onClose: () => void
}) {
  const { t } = useTranslation('common.modals')

  const [file, setFile] = useState<File | string | null>(null)

  const [preview, setPreview] = useState<string | null>(null)

  const [mode, setMode] = useState<'local' | 'url' | 'pixabay' | 'ai'>('local')

  const [loading, onClick] = usePromiseLoading(() =>
    onSelect(file as string | File, preview)
      .catch(console.error)
      .finally(() => {
        onClose()
      })
  )

  useEffect(() => {
    setFile(null)
    setMode('local')
  }, [])

  return (
    <Box minWidth="70vw">
      <ModalHeader
        icon="tabler:photo"
        title="imagePicker.title"
        onClose={onClose}
      />
      {(enablePixabay || enableUrl || enableAI) && (
        <Tabs
          currentTab={mode}
          enabled={(['local', 'url', 'pixabay', 'ai'] as const).filter(
            name =>
              name === 'local' ||
              (name === 'pixabay' && enablePixabay) ||
              (name === 'url' && enableUrl) ||
              (name === 'ai' && enableAI)
          )}
          items={[
            {
              name: t('imagePicker.local'),
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
            },
            {
              name: t('imagePicker.ai'),
              icon: 'tabler:robot',
              id: 'ai'
            }
          ]}
          onTabChange={(id: 'local' | 'url' | 'pixabay' | 'ai') => {
            setMode(id)
            setFile(null)
          }}
        />
      )}
      <Flex
        direction="column"
        height="100%"
        my="lg"
        style={{ minHeight: 0 }}
        width="100%"
      >
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
                  setFile={setFile}
                  setPreview={setPreview}
                />
              )
            case 'ai':
              return (
                <AIImageGenerator
                  defaultPrompt={defaultAIPrompt || ''}
                  file={file}
                  setFile={setFile}
                  setPreview={setPreview}
                />
              )
          }
        })()}
      </Flex>
      <Button
        disabled={file === null}
        icon="tabler:check"
        loading={loading}
        style={{ marginTop: '1rem', width: '100%' }}
        onClick={onClick}
      >
        select
      </Button>
    </Box>
  )
}
