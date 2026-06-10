import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'

import { useFederation } from '@lifeforge/federation'
import {
  EmptyStateScreen,
  Grid,
  ModuleHeader,
  Stack,
  Text,
  WithQuery,
  toast,
  usePersonalization
} from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

import ModuleItem from './components/ModuleItem'

export interface InstalledModule {
  name: string
  displayName: string
  version: string
  description: string
  author: string
  icon: string
  category: string
  isInternal: boolean
  isDevMode: boolean
  hasDist: boolean
  hasSource: boolean
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
        refetchFederation.current()
      } else {
        toast.error(data.error || 'Failed to uninstall module')
      }
    },
    onError: () => {
      toast.error('Failed to uninstall module')
    }
  })
  const groupedModules = useMemo(() => {
    if (!modulesQuery.data) return {}

    const groups: Record<string, InstalledModule[]> = {}

    for (const mod of modulesQuery.data) {
      const category = mod.category || 'Miscellaneous'

      if (!groups[category]) {
        groups[category] = []
      }

      groups[category].push(mod)
    }

    return groups
  }, [modulesQuery.data])

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
        namespace="common.module-manager"
        title="modules"
        tKey="subsectionTitleAndDesc"
        totalItems={modulesQuery.data?.length}
      />
      <WithQuery query={modulesQuery}>
        {modules =>
          modules.length > 0 ? (
            <Stack gap="2xl" mb="2xl">
              {Object.entries(groupedModules).map(([category, mods]) => (
                <Stack key={category} as="section">
                  <Text as="h2" size="2xl" weight="medium">
                    {getCategoryName(category)}
                    <Text color="muted" ml="sm" size="sm">
                      ({mods.length})
                    </Text>
                  </Text>
                  <Grid gap="md" templateCols={{ base: 1, md: 2, lg: 3 }}>
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
                  </Grid>
                </Stack>
              ))}
            </Stack>
          ) : (
            <EmptyStateScreen
              icon="tabler:apps-off"
              message={{
                id: 'modules',
                namespace: 'common.module-manager'
              }}
            />
          )
        }
      </WithQuery>
    </>
  )
}

export default Modules
