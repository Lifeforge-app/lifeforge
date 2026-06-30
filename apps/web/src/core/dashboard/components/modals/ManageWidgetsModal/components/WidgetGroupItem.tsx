import { useTranslation } from 'react-i18next'

import { Box, Flex, Stack, Text } from '@lifeforge/ui'

import type { WidgetEntry } from '@/core/dashboard/providers/WidgetProvider'

import ComponentListItem from './ComponentItem'

function WidgetGroupItem({
  moduleName,
  items
}: {
  moduleName: string
  items: Array<[string, WidgetEntry]>
}) {
  const { t } = useTranslation(`apps.${moduleName}`)

  return (
    <Stack as="li" gap="sm">
      <Flex align="center" gap="md">
        <Box bg="custom-500" height="1.5em" r="full" width="3px" />
        <Text
          color="muted"
          tracking="wide"
          transform="uppercase"
          weight="semibold"
        >
          {t('title')}
        </Text>
      </Flex>
      <Stack as="ul" gap="xs">
        {items.map(
          ([
            key,
            { icon, minW, minH, maxW, maxH, moduleName: itemModuleName }
          ]) => (
            <ComponentListItem
              key={key}
              icon={icon}
              id={key}
              maxH={maxH}
              maxW={maxW}
              minH={minH}
              minW={minW}
              moduleName={itemModuleName ?? undefined}
            />
          )
        )}
      </Stack>
    </Stack>
  )
}

export default WidgetGroupItem
