import { useTranslation } from 'react-i18next'

import { useFederation } from '@lifeforge/federation'
import { Box, ModalHeader, Stack, Text } from '@lifeforge/ui'

import ModuleRequiredCard from './components/ModuleRequiredCard'

function ModulesRequiredListModal({
  onClose,
  data: { keyId }
}: {
  onClose: () => void
  data: {
    keyId: string
  }
}) {
  const { t } = useTranslation('common.api-keys')
  const { modules } = useFederation()

  const modulesRequired = modules
    .flatMap(cat => cat.items)
    .filter(item => item.APIKeyAccess?.[keyId])

  return (
    <Box minWidth="40vw">
      <ModalHeader
        icon="tabler:cube"
        namespace="common.api-keys"
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
          <ModuleRequiredCard key={module.name} keyId={keyId} module={module} />
        ))}
      </Stack>
    </Box>
  )
}

export default ModulesRequiredListModal
