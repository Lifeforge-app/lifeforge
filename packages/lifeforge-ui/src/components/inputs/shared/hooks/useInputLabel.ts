import _ from 'lodash'
import { useTranslation } from 'react-i18next'

export default function useInputLabel({
  namespace,
  label
}: {
  namespace?: string
  label: string
}) {
  const { t } = useTranslation(namespace)

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
