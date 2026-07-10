import { useState } from 'react'

import { usePromiseLoading } from '@lifeforge/api'

import { Button, type FilePickerSourceConfig } from '@/components/inputs'
import { ModalHeader } from '@/components/overlays'
import { Box, Flex } from '@/components/primitives'

import { FilePickerContext } from './contexts/FilePickerContext'
import { FILE_PICKET_TABS, useTabbedView } from './tabs'

export function FilePickerModal({
  data: { sources, mimeTypes, onSelect },
  onClose
}: {
  data: {
    sources: FilePickerSourceConfig
    mimeTypes?: Record<string, string[]>
    onSelect: (file: string | File, preview: string | null) => Promise<void>
  }
  onClose: () => void
}) {
  const [file, setFile] = useState<File | string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const TabbedView = useTabbedView(sources)

  const [loading, onClick] = usePromiseLoading(() =>
    onSelect(file as string | File, preview)
      .catch(console.error)
      .finally(() => {
        onClose()
      })
  )

  return (
    <Box minWidth="70vw">
      <ModalHeader
        icon="tabler:photo"
        title="imagePicker.title"
        onClose={onClose}
      />
      {Object.values(sources).some(e => e) && (
        <FilePickerContext.Provider
          value={{
            acceptedMimeTypes: mimeTypes,
            file,
            preview,
            setFile,
            setPreview,
            sources
          }}
        >
          <TabbedView.Root onTabChange={() => setFile(null)}>
            <TabbedView.Selector />
            <Flex
              direction="column"
              height="100%"
              my="lg"
              style={{ minHeight: 0 }}
              width="100%"
            >
              {Object.entries(FILE_PICKET_TABS).map(
                ([tabId, { Component }]) => (
                  <TabbedView.When
                    key={tabId}
                    tabId={tabId as keyof typeof FILE_PICKET_TABS}
                  >
                    <Component />
                  </TabbedView.When>
                )
              )}
            </Flex>
          </TabbedView.Root>
        </FilePickerContext.Provider>
      )}
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
