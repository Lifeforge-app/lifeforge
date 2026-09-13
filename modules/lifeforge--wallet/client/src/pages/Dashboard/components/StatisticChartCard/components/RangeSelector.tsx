import type { ComponentProps } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  Flex,
  Icon,
  Listbox,
  ListboxOption,
  Text,
  surface
} from '@lifeforge/ui'

function RangeSelector({
  range,
  setRange,
  display
}: {
  range: 'week' | 'month' | 'ytd'
  setRange: (value: 'week' | 'month' | 'ytd') => void
  display?: ComponentProps<typeof Box>['display']
}) {
  const { t } = useModuleTranslation()

  return (
    <Box display={display}>
      <Listbox
        bg={surface.light}
        renderContent={() => (
          <Flex align="center" gap="md">
            <Icon color="muted" icon="tabler:history" size="1.5rem" />
            <Text whiteSpace="nowrap">{t(`timeRanges.${range}`)}</Text>
          </Flex>
        )}
        value={range}
        onChange={setRange}
      >
        {['week', 'month', 'ytd'].map(option => (
          <ListboxOption
            key={option}
            label={t(`timeRanges.${option}`)}
            value={option}
          />
        ))}
      </Listbox>
    </Box>
  )
}

export default RangeSelector
