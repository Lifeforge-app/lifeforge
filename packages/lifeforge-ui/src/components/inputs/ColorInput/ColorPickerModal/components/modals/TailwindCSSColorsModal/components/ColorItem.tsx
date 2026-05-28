import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { converter, formatHex, parse } from 'culori'
import { memo, useMemo } from 'react'

import { usePersonalization } from 'shared/dist/providers/PersonalizationProvider'

import { Box, Flex, Text } from '@components/primitives'

import * as styles from './ColorItem.css'

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
      <Flex asChild align="center" justify="center" rounded="md" width="100%">
        <button
          className={clsx(
            styles.colorButton,
            selected === value && styles.colorButtonSelected
          )}
          style={{ backgroundColor: value }}
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
        </button>
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
