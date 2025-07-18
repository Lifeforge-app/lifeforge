import {
  ListboxOrComboboxInput,
  ListboxOrComboboxOption,
  QueryWrapper
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import { useAPIQuery } from 'shared/lib'

function NamespaceSelector({
  namespace,
  setNamespace,
  subNamespace,
  setSubNamespace,
  showWarning
}: {
  namespace: 'common' | 'core' | 'apps' | 'utils' | null
  setNamespace: (value: 'common' | 'core' | 'apps' | 'utils' | null) => void
  subNamespace: string | null
  setSubNamespace: (value: string | null) => void
  showWarning: boolean
}) {
  const { t } = useTranslation('utils.localeAdmin')

  const subNamespacesQuery = useAPIQuery<string[]>(
    `/locales/manager/${namespace}`,
    ['namespace', namespace],
    !!namespace
  )

  return (
    <div className="mt-6 flex flex-col">
      <div className="flex w-full items-center gap-4">
        <ListboxOrComboboxInput
          buttonContent={
            <div>
              {namespace
                ? t(`namespaces.${namespace}`)
                : t(`inputs.namespace.placeholder`)}
            </div>
          }
          className={namespace ? 'w-1/2' : 'w-full'}
          icon="tabler:category-2"
          name="namespace"
          namespace="utils.localeAdmin"
          setValue={value => {
            if (showWarning && namespace !== value) {
              if (!window.confirm(t('warnings.unsavedChanges'))) {
                return
              }
            }
            setNamespace(value)
            setSubNamespace(null)
          }}
          type="listbox"
          value={namespace}
        >
          {['common', 'core', 'apps', 'utils'].map(ns => (
            <ListboxOrComboboxOption
              key={ns}
              icon="tabler:category-2"
              text={t(`namespaces.${ns}`)}
              value={ns}
            />
          ))}
        </ListboxOrComboboxInput>
        {namespace && (
          <QueryWrapper query={subNamespacesQuery}>
            {subNamespaces => (
              <ListboxOrComboboxInput
                buttonContent={
                  <div>
                    {namespace
                      ? subNamespace
                      : t(`inputs.subNamespace.placeholder`)}
                  </div>
                }
                className="w-1/2"
                icon="tabler:cube"
                name="sub namespace"
                namespace="utils.localeAdmin"
                setValue={value => {
                  if (showWarning && subNamespace !== value) {
                    if (!window.confirm(t('warnings.unsavedChanges'))) {
                      return
                    }
                  }
                  setSubNamespace(value)
                }}
                type="listbox"
                value={subNamespace}
              >
                {subNamespaces.map(sns => (
                  <ListboxOrComboboxOption
                    key={sns}
                    icon="tabler:cube"
                    text={sns}
                    value={sns}
                  />
                ))}
              </ListboxOrComboboxInput>
            )}
          </QueryWrapper>
        )}
      </div>
    </div>
  )
}

export default NamespaceSelector
