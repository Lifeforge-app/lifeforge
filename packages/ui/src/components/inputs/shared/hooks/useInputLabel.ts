import _ from 'lodash'

import { useModuleTranslation } from '@lifeforge/localization'

export function useInputLabel({
  namespace,
  label
}: {
  namespace?: string
  label: string
}) {
  const { t } = useModuleTranslation(namespace ? [namespace] : undefined)

  if (!namespace) return label

  const nameKey = _.camelCase(label)

  return t([
    `inputs.${nameKey}.label`,
    `inputs.${nameKey}`,
    `${nameKey}.label`,
    nameKey,
    label
  ])
}
