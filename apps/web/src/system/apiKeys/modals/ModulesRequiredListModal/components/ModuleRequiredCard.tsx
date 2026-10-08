import { useTranslation } from 'react-i18next'

import {
  Box,
  Card,
  Flex,
  Icon,
  TAILWIND_PALETTE,
  TagChip,
  Text,
  colorWithOpacity,
  surface
} from '@lifeforge/ui'

function ModuleRequiredCard({
  module,
  keyId
}: {
  module: {
    name: string
    icon: string
    APIKeyAccess?: Record<string, { usage: string; required: boolean }>
  }
  keyId: string
}) {
  const { t } = useTranslation([`apps.${module.name}`, 'common.api-keys'])

  return (
    <Card
      key={module.name}
      align={{ base: 'end', sm: 'center' }}
      bg={surface.light}
      direction="row"
      gap="md"
      justify="between"
    >
      <Flex
        align={{ base: 'start', sm: 'center' }}
        direction={{ base: 'column', sm: 'row' }}
        gap="md"
      >
        <Flex
          centered
          bg={colorWithOpacity('bg-500', '20%')}
          flexShrink="0"
          height="3.2em"
          r="md"
          width="3.2em"
        >
          <Icon color="bg-500" icon={module.icon} size="1.75em" />
        </Flex>
        <Box minWidth="0">
          <Text as="h3" size="lg" weight="medium">
            {t('title')}
          </Text>
          <Text as="p" color="muted" mt="xs">
            {module.APIKeyAccess?.[keyId]?.usage}
          </Text>
        </Box>
      </Flex>

      {module.APIKeyAccess?.[keyId]?.required ? (
        <TagChip
          color={TAILWIND_PALETTE.red['500']}
          flexShrink="0"
          icon="tabler:alert-circle"
          label={t('common.api-keys:modals.modulesRequired.required')}
        />
      ) : (
        <TagChip
          color={TAILWIND_PALETTE.green['500']}
          flexShrink="0"
          icon="tabler:circle-check"
          label={t('common.api-keys:modals.modulesRequired.optional')}
        />
      )}
    </Card>
  )
}

export default ModuleRequiredCard
