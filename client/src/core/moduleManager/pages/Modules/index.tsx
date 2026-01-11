import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { EmptyStateScreen, ModuleHeader, WithQuery } from 'lifeforge-ui'
import { useMemo } from 'react'
import { toast } from 'react-toastify'
import { usePersonalization } from 'shared'

import { useFederation } from '@/federation'
import forgeAPI from '@/forgeAPI'

import ModuleItem from './components/ModuleItem'

interface ModuleData {
  name: string
  displayName: string
  version: string
  description: string
  author: string
  icon: string
  category: string
}

function Modules() {
  const { refetch: refetchFederation, categoryTranslations } = useFederation()

  const { language } = usePersonalization()

  const queryClient = useQueryClient()

  const modulesQuery = useQuery(forgeAPI.modules.list.queryOptions())

  const uninstallMutation = useMutation({
    mutationFn: (moduleName: string) =>
      forgeAPI.modules.uninstall.mutate({ moduleName }),
    onSuccess: (data, moduleName) => {
      if (data.success) {
        toast.success(`Uninstalled ${moduleName}`)
        queryClient.invalidateQueries({ queryKey: ['modules', 'list'] })
        refetchFederation()
      } else {
        toast.error(data.error || 'Failed to uninstall module')
      }
    },
    onError: () => {
      toast.error('Failed to uninstall module')
    }
  })

  const groupedModules = useMemo(() => {
    if (!modulesQuery.data?.modules) return {}

    const groups: Record<string, ModuleData[]> = {}

    for (const mod of modulesQuery.data.modules) {
      const category = mod.category || 'Miscellaneous'

      if (!groups[category]) {
        groups[category] = []
      }

      groups[category].push(mod)
    }

    return groups
  }, [modulesQuery.data?.modules])

  function getCategoryName(category: string): string {
    const translations = categoryTranslations[category.toLowerCase()]

    if (translations) {
      return translations[language] || category
    }

    return category
  }

  return (
    <>
      <ModuleHeader
        icon="tabler:apps"
        namespace="common.moduleManager"
        title="modules"
        tKey="subsectionTitleAndDesc"
        totalItems={modulesQuery.data?.modules.length}
      />
      <WithQuery query={modulesQuery}>
        {({ modules }) =>
          modules.length > 0 ? (
            <div className="mb-12 space-y-12">
              {Object.entries(groupedModules).map(([category, mods]) => (
                <section key={category}>
                  <h2 className="text-bg-500 mb-4 text-2xl font-medium">
                    {getCategoryName(category)}
                    <span className="text-bg-400 dark:text-bg-600 ml-2 text-sm font-normal">
                      ({mods.length})
                    </span>
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {mods.map(mod => (
                      <ModuleItem
                        key={mod.name}
                        module={mod}
                        onDevModeChange={() => {
                          queryClient.invalidateQueries({
                            queryKey: ['modules', 'list']
                          })
                        }}
                        onUninstall={async moduleName => {
                          await uninstallMutation.mutateAsync(moduleName)
                        }}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <EmptyStateScreen
              icon="tabler:apps-off"
              message={{
                id: 'modules',
                namespace: 'common.moduleManager'
              }}
            />
          )
        }
      </WithQuery>
    </>
  )
}

export default Modules
