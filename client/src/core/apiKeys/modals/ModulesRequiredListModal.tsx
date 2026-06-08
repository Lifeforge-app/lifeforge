import { useTranslation } from 'react-i18next'

import { useFederation } from '@lifeforge/federation'
import {
  Box,
  Card,
  Flex,
  Icon,
  ModalHeader,
  Stack,
  TAILWIND_PALETTE,
  TagChip,
  Text,
  colorWithOpacity
} from '@lifeforge/ui'

function ModulesRequiredListModal({
  onClose,
  data: { keyId }
}: {
  onClose: () => void
  data: {
    keyId: string
  }
}) {
  const { t } = useTranslation('common.apiKeys')

  const { modules } = useFederation()

  const modulesRequired = modules
    .flatMap(cat => cat.items)
    .filter(item => item.APIKeyAccess?.[keyId])

  return (
    <Box minWidth="40vw">
      <ModalHeader
        icon="tabler:cube"
        namespace="common.apiKeys"
        title="modulesRequired.title"
        onClose={onClose}
      />
      <Text as="p" color="muted">
        {t('modals.modulesRequired.totalModulesRequire', {
          count: modulesRequired.length
        })}
      </Text>
      <Stack mt="lg">
        {modulesRequired.map(module => (
          <Card
            key={module.name}
            align="center"
            bg={{
              base: 'bg-50',
              dark: 'bg-800'
            }}
            direction="row"
            justify="between"
          >
            <Flex align="center" gap="md">
              <Flex
                centered
                bg={colorWithOpacity('bg-500', '20%')}
                height="3.2em"
                r="md"
                width="3.2em"
              >
                <Icon color="bg-500" icon={module.icon} size="1.75em" />
              </Flex>

              <Box>
                <Text as="h3" size="lg" weight="medium">
                  {module.name}
                </Text>
                <Text as="p" color="muted" mt="xs">
                  {module.APIKeyAccess?.[keyId].usage}
                </Text>
              </Box>
            </Flex>

            {module.APIKeyAccess?.[keyId].required ? (
              <TagChip
                color={TAILWIND_PALETTE.red['500']}
                icon="tabler:alert-circle"
                label="Required"
              />
            ) : (
              <TagChip
                color={TAILWIND_PALETTE.green['500']}
                icon="tabler:circle-check"
                label="Optional"
              />
            )}
          </Card>
        ))}
      </Stack>
    </Box>
  )
}

export default ModulesRequiredListModal
