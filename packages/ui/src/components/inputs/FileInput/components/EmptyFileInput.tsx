import { useTranslation } from 'react-i18next'

import { Button } from '@/components/inputs'
import { Box, Text } from '@/components/primitives'

export function EmptyFileInput({
  acceptedMimeTypes,
  reminderText,
  onSelect
}: {
  acceptedMimeTypes?: Record<string, string[]>
  reminderText?: string
  onSelect: () => void
}) {
  const { t } = useTranslation('common.misc')

  return (
    <>
      <Box asChild my="md">
        <Button
          icon="tabler:file-plus"
          style={{ width: '100%' }}
          variant="secondary"
          onClick={onSelect}
        >
          Select
        </Button>
      </Box>
      <Text align="center" as="p" color="muted" size="sm">
        {reminderText ||
          t('fileInputSupportedFormat', {
            format: acceptedMimeTypes
              ? Object.entries(acceptedMimeTypes)
                  .flatMap(function ([type, exts]) {
                    return exts.map(function (ext) {
                      return `${type}/${ext}`
                    })
                  })
                  .join(', ') || 'N/A'
              : 'N/A'
          })}
      </Text>
    </>
  )
}
