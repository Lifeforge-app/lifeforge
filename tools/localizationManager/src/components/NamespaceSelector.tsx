import { useQuery } from '@tanstack/react-query'
import { ListboxInput, ListboxOption, WithQuery } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import forgeAPI from '../utils/forgeAPI'

function NamespaceSelector({
  namespace,
  setNamespace,
  subNamespace,
  setSubNamespace,
  showWarning
}: {
  namespace: 'common' | 'apps' | null
  setNamespace: (value: 'common' | 'apps' | null) => void
  subNamespace: string | null
  setSubNamespace: (value: string | null) => void
  showWarning: boolean
}) {
  const { t } = useTranslation('apps.localizationManager')

  const subNamespacesQuery = useQuery(
    forgeAPI.locales.manager.listSubnamespaces
      .input({
        namespace: namespace!
      })
      .queryOptions({
        enabled: !!namespace
      })
  )

  return (
    <div className="mt-6 flex flex-col">
      <div className="flex w-full items-center gap-3">
        <ListboxInput
          buttonContent={
            <div>
              {namespace
                ? t(`namespaces.${namespace}`)
                : t(`inputs.namespace.placeholder`)}
            </div>
          }
          className={namespace ? 'w-1/2' : 'w-full'}
          icon="tabler:category-2"
          label="namespace"
          namespace="apps.localizationManager"
          setValue={value => {
            if (showWarning && namespace !== value) {
              if (!window.confirm(t('warnings.unsavedChanges'))) {
                return
              }
            }
            setNamespace(value)
            setSubNamespace(null)
          }}
          value={namespace}
        >
          {['common', 'apps'].map(ns => (
            <ListboxOption
              key={ns}
              icon="tabler:category-2"
              label={t(`namespaces.${ns}`)}
              value={ns}
            />
          ))}
        </ListboxInput>
        {namespace && (
          <WithQuery query={subNamespacesQuery}>
            {subNamespaces => (
              <ListboxInput
                buttonContent={
                  <div>
                    {namespace
                      ? subNamespace
                      : t(`inputs.subNamespace.placeholder`)}
                  </div>
                }
                className="w-1/2"
                icon="tabler:cube"
                label="sub namespace"
                namespace="apps.localizationManager"
                setValue={value => {
                  if (showWarning && subNamespace !== value) {
                    if (!window.confirm(t('warnings.unsavedChanges'))) {
                      return
                    }
                  }
                  setSubNamespace(value)
                }}
                value={subNamespace}
              >
                {subNamespaces.map(sns => (
                  <ListboxOption
                    key={sns}
                    icon="tabler:cube"
                    label={sns || 'N/A'}
                    value={sns}
                  />
                ))}
              </ListboxInput>
            )}
          </WithQuery>
        )}
      </div>
    </div>
  )
}

export default NamespaceSelector
