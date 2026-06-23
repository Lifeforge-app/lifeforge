import _ from 'lodash'

import { useModuleTranslation } from '@lifeforge/localization'

export function useInputLabel({
  namespace,
  label
}: {
  namespace?: string | false
  label: string
}) {
  const { t } = useModuleTranslation(namespace ? [namespace] : undefined)

  if (namespace === false) {
    return label
  }

  return t(
    [
      `inputs.${_.camelCase(label)}.label`,
      `inputs.${_.camelCase(label)}`,
      `inputs.${label}.label`,
      `inputs.${label}`,
      `${_.camelCase(label)}.label`,
      `${_.camelCase(label)}`,
      `${label}.label`,
      `${label}`,
      ...(namespace
        ? [
            `${namespace}:inputs.${_.camelCase(label)}.label`,
            `${namespace}:inputs.${_.camelCase(label)}`,
            `${namespace}:inputs.${label}.label`,
            `${namespace}:inputs.${label}`,
            `${namespace}:${_.camelCase(label)}.label`,
            `${namespace}:${_.camelCase(label)}`,
            `${namespace}:${label}.label`,
            `${namespace}:${label}`
          ]
        : [])
    ],
    {
      defaultValue: label
    }
  )
}
