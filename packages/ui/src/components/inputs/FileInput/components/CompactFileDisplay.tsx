import { Button } from '@/components/inputs'
import { Flex, Icon, Text } from '@/components/primitives'

import type { FileValue } from '..'
import { FILE_ICONS } from '../FilePickerModal/constants/file_icons'

export function CompactFileDisplay({
  value,
  onChange,
  onImageRemoved
}: {
  value: FileValue
  onChange: (value: FileValue) => void
  onImageRemoved?: () => void
}) {
  return (
    <Flex align="center" gap="xl" justify="between" mt="md">
      <Flex align="center" gap="sm" minWidth="0">
        <Icon
          color="muted"
          icon={(() => {
            if (value.type !== 'file') return 'tabler:file'

            const ext = (
              value.source === 'existing'
                ? value.filename
                : value.source === 'upload'
                  ? value.file.name
                  : value.url.split('/').pop()?.split('?')[0] || ''
            )
              .split('.')
              .pop()
              ?.toLowerCase()

            return (
              FILE_ICONS[ext as keyof typeof FILE_ICONS] ||
              'tabler:file'
            )
          })()}
          size="1.5rem"
        />
        <Text truncate as="p">
          {(() => {
            if (value.type !== 'file') return ''
            if (value.source === 'existing') return value.filename
            if (value.source === 'upload') return value.file.name

            return value.url
          })()}
        </Text>
      </Flex>
      <Button
        icon="tabler:x"
        p="sm"
        variant="plain"
        onClick={function () {
          onChange({ type: 'empty' })
          onImageRemoved?.()
        }}
      />
    </Flex>
  )
}
