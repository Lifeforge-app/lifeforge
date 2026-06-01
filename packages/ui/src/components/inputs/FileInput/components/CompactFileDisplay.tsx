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
            if (value.type === 'empty') return 'tabler:file'

            const ext = (
              value.type === 'existing'
                ? value.filename
                : value.type === 'upload'
                  ? value.file.name
                  : value.type === 'url'
                    ? value.url.split('/').pop()?.split('?')[0] || ''
                    : ''
            )
              .split('.')
              .pop()
              ?.toLowerCase()

            return FILE_ICONS[ext as keyof typeof FILE_ICONS] || 'tabler:file'
          })()}
          size="1.5rem"
        />
        <Text truncate as="p">
          {(() => {
            if (value.type === 'empty') return ''
            if (value.type === 'existing') return value.filename
            if (value.type === 'upload') return value.file.name

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
