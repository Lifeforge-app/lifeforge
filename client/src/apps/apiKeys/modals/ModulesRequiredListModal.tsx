import { Icon } from '@iconify/react'
import { Card, ModalHeader, TagChip } from 'lifeforge-ui'
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
  const modulesRequired = ROUTES.flatMap(cat => cat.items).filter(item =>
    item.apiAccess?.some(access => access.key === keyId)
  )

  return (
    <div className="min-w-[40vw] space-y-6">
      <ModalHeader
        icon="tabler:cube"
        title="Modules Required"
        onClose={onClose}
      />
      <p className="text-bg-500">
        A total of {modulesRequired.length} modules require this API Key.
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
                {module.apiAccess?.find(access => access.key === keyId)?.usage}
              </p>
            </div>
            {module.apiAccess?.find(access => access.key === keyId)
              ?.required ? (
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
