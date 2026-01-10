import { Icon } from '@iconify/react'
import { Card, ModalHeader, TagChip } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import COLORS from 'tailwindcss/colors'

import ROUTES from '@/routes'

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

  const modulesRequired = ROUTES.flatMap(cat => cat.items).filter(
    item => item.APIKeyAccess?.[keyId]
  )

  return (
    <div className="min-w-[40vw] space-y-6">
      <ModalHeader
        icon="tabler:cube"
        namespace="common.apiKeys"
        title="modulesRequired.title"
        onClose={onClose}
      />
      <p className="text-bg-500">
        {t('modals.modulesRequired.totalModulesRequire', {
          count: modulesRequired.length
        })}
      </p>
      <div className="space-y-3">
        {modulesRequired.map(module => (
          <Card key={module.name} className="component-bg-lighter flex-between">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-medium">
                <Icon className="size-6" icon={module.icon} />
                {module.name}
              </h3>
              <p className="text-bg-500 mt-1">
                {module.APIKeyAccess?.[keyId].usage}
              </p>
            </div>
            {module.APIKeyAccess?.[keyId].required ? (
              <TagChip
                color={COLORS.red['500']}
                icon="tabler:alert-circle"
                iconClassName="size-3.5!"
                label="Required"
              />
            ) : (
              <TagChip
                color={COLORS.green['500']}
                icon="tabler:circle-check"
                iconClassName="size-3.5!"
                label="Optional"
              />
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ModulesRequiredListModal
