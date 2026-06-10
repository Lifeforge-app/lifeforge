import { converter, formatHex, parse } from 'culori'
import { memo, useMemo } from 'react'

import { Box, Flex, Icon, Text } from '@/components/primitives'
import { usePersonalization } from '@/providers'

function _ColorItem({
  name,
  value,
  selected,
  onSelect
}: {
  name: string
  value: string
  selected: string
  onSelect: (color: string) => void
}) {
  const { getMostReadableColor } = usePersonalization()
  
const colorHex = useMemo(
    () => formatHex(converter('rgb')(parse(value))) || '',
    [value]
  )

  return (
    <Box as="li" width="100%">
      <Flex asChild centered r="md" width="100%">
        <Box
          shadow
          as="button"
          style={{
            aspectRatio: '1/1',
            backgroundColor: value
          }}
          onClick={() => onSelect(colorHex)}
        >
          {selected === colorHex && (
            <Icon
              icon="tabler:check"
              style={{
                width: '2rem',
                height: '2rem',
                color: getMostReadableColor(colorHex)
              }}
            />
          )}
        </Box>
      </Flex>
      <Text as="p" mt="sm" size="sm" weight="medium">
        {name}
      </Text>
      <Text as="code" color="muted" display="block" size="sm" weight="medium">
        {colorHex}
      </Text>
    </Box>
  )
}

export const ColorItem = memo(_ColorItem, (prevProps, nextProps) => {
  return (
    prevProps.selected === nextProps.selected &&
    prevProps.value === nextProps.value
  )
})
