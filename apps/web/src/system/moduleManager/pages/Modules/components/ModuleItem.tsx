import { useTranslation } from 'react-i18next'

import {
  Box,
  Card,
  Flex,
  Icon,
  TAILWIND_PALETTE,
  TagChip,
  Text,
  colorWithOpacity
} from '@lifeforge/ui'

import type { Module } from '..'

function ModuleItem({ module }: { module: Module }) {
  // Module name format: @lifeforge/lifeforge--wallet -> lifeforge--wallet
  const moduleKey = module.name.replace('@lifeforge/', '')

  const { t, i18n } = useTranslation([
    `apps.${moduleKey}`,
    'common.module-manager'
  ])

  const translatedTitle = i18n.exists(`apps.${moduleKey}:title`)
    ? t(`apps.${moduleKey}:title`)
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
              {module.isDevMode && (
                <TagChip
                  color={TAILWIND_PALETTE.yellow[500]}
                  flexShrink="0"
                  icon="tabler:code"
                  label={t('common.module-manager:devMode.label')}
                  size="sm"
                  variant="outlined"
                />
              )}
              {!module.hasDist && (
                <TagChip
                  color={TAILWIND_PALETTE.red[500]}
                  flexShrink="0"
                  icon="tabler:alert-triangle"
                  label={t('common.module-manager:notBuilt.label')}
                  size="sm"
                  variant="outlined"
                />
              )}
            </Flex>
            <Text color="muted" size="sm">
              v{module.version}
            </Text>
          </Box>
        </Flex>
      </Flex>
      <Text as="p" color="muted" leading="relaxed" lineClamp={2}>
        {i18n.exists(`apps.${moduleKey}:description`)
          ? t([`apps.${moduleKey}:description`])
          : module.description}
      </Text>
      <Box style={{ marginTop: 'auto' }}>
        {module.author && (
          <Flex asChild align="center" gap="sm">
            <Text color="muted">
              <Icon icon="tabler:user" size="1.1rem" />
              <span>{module.author.split('<')[0].trim()}</span>
            </Text>
          </Flex>
        )}
      </Box>
    </Card>
  )
}

export default ModuleItem
