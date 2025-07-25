import _ from 'lodash'
import { useTranslation } from 'react-i18next'

export default function useInputLabel(
  namespace: string | false,
  name: string,
  tKey?: string
) {
  const { t } = useTranslation(namespace ? namespace : undefined)

  if (!namespace) return name

  const nameKey = _.camelCase(name)

  const labelKey = [tKey, 'inputs', nameKey, 'label'].filter(Boolean).join('.')

  const fallbackKey = [tKey, 'inputs', nameKey].filter(Boolean).join('.')

  return t([labelKey, fallbackKey, name])
}
