import { useQuery } from '@tanstack/react-query'
import { ListboxInput, ListboxOption, QueryWrapper } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import forgeAPI from '../utils/forgeAPI'

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
      <div className="flex w-full items-center gap-4">
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
          value={namespace}
        >
          {['common', 'core', 'apps', 'utils'].map(ns => (
            <ListboxOption
              key={ns}
              icon="tabler:category-2"
              text={t(`namespaces.${ns}`)}
              value={ns}
            />
          ))}
        </ListboxInput>
        {namespace && (
          <QueryWrapper query={subNamespacesQuery}>
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
                namespace="utils.localeAdmin"
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
                    text={sns}
                    value={sns}
                  />
                ))}
              </ListboxInput>
            )}
          </QueryWrapper>
        )}
      </div>
    </div>
  )
}

export default NamespaceSelector
