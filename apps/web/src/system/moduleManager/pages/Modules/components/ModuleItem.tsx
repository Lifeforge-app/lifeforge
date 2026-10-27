import { useTranslation } from 'react-i18next'

import type { Module } from '@lifeforge/configs'
import { Box, Card, Flex, Icon, Text, colorWithOpacity } from '@lifeforge/ui'

function ModuleItem({ module }: { module: Module }) {
  const { t, i18n } = useTranslation([
    `apps.${module.name}`,
    'common.module-manager'
  ])

  const translatedTitle = i18n.exists(`apps.${module.name}:title`)
    ? t(`apps.${module.name}:title`)
    : module.displayName

  return (
    <Card gap="md" minWidth="0">
      <Flex align="start" gap="md">
        <Flex
          centered
          shadow
          bg={colorWithOpacity('custom-500', '20%')}
          flexShrink="0"
          height="3em"
          r="lg"
          width="3em"
        >
          <Icon color="primary" icon={module.icon} size="1.5em" />
        </Flex>
        <Flex align="start" flex="1" gap="md" justify="between" minWidth="0">
          <Box minWidth="0">
            <Flex align="center" gap="sm">
              <Text truncate as="h3" size="lg" weight="semibold">
                {translatedTitle}
              </Text>
            </Flex>
            <Text color="muted" size="sm">
              v{module.version}
            </Text>
          </Box>
        </Flex>
      </Flex>
      <Text as="p" color="muted" leading="relaxed" lineClamp={2}>
        {i18n.exists(`apps.${module.name}:description`)
          ? t([`apps.${module.name}:description`])
          : module.description}
      </Text>
      <Box style={{ marginTop: 'auto' }}>
        {module.author && (
          <Flex asChild align="center" gap="sm">
            <Text color="muted">
              <Icon icon="tabler:user" size="1.1em" />
              {module.author.split('<')[0]?.trim()}
            </Text>
          </Flex>
        )}
      </Box>
    </Card>
  )
}

export default ModuleItem
