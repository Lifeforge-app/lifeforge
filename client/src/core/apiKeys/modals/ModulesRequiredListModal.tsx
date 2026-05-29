import { useTranslation } from 'react-i18next'

import { useFederation } from '@lifeforge/shared'
import {
  Box,
  Card,
  Flex,
  Icon,
  ModalHeader,
  Stack,
  TAILWIND_PALETTE,
  TagChip,
  Text
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
            <Box>
              <Flex asChild centered gap="sm">
                <Text as="h3" size="lg" weight="medium">
                  <Icon icon={module.icon} />
                  {module.name}
                </Text>
              </Flex>
              <Text as="p" color="muted" mt="xs">
                {module.APIKeyAccess?.[keyId].usage}
              </Text>
            </Box>
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
