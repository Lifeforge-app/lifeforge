import {
  ListboxOrComboboxInput,
  ListboxOrComboboxOption,
  QueryWrapper
} from 'lifeforge-ui'
import React from 'react'
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
}): React.ReactElement {
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
          type="listbox"
          icon="tabler:category-2"
          name="namespace"
          namespace="utils.localeAdmin"
          className={namespace ? 'w-1/2' : 'w-full'}
          value={namespace}
          setValue={value => {
            if (showWarning && namespace !== value) {
              if (!window.confirm(t('warnings.unsavedChanges'))) {
                return
              }
            }
            setNamespace(value)
            setSubNamespace(null)
          }}
          buttonContent={
            <div>
              {namespace
                ? t(`namespaces.${namespace}`)
                : t(`inputs.namespace.placeholder`)}
            </div>
          }
        >
          {['common', 'core', 'apps', 'utils'].map(ns => (
            <ListboxOrComboboxOption
              key={ns}
              value={ns}
              text={t(`namespaces.${ns}`)}
              icon="tabler:category-2"
            />
          ))}
        </ListboxOrComboboxInput>
        {namespace && (
          <QueryWrapper query={subNamespacesQuery}>
            {subNamespaces => (
              <ListboxOrComboboxInput
                type="listbox"
                icon="tabler:cube"
                name="sub namespace"
                namespace="utils.localeAdmin"
                className="w-1/2"
                value={subNamespace}
                setValue={value => {
                  if (showWarning && subNamespace !== value) {
                    if (!window.confirm(t('warnings.unsavedChanges'))) {
                      return
                    }
                  }
                  setSubNamespace(value)
                }}
                buttonContent={
                  <div>
                    {namespace
                      ? subNamespace
                      : t(`inputs.subNamespace.placeholder`)}
                  </div>
                }
              >
                {subNamespaces.map(sns => (
                  <ListboxOrComboboxOption
                    key={sns}
                    value={sns}
                    text={sns}
                    icon="tabler:cube"
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
