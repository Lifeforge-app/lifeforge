import { useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'
import { useEffect } from 'react'

import { ModuleMetadataProvider } from '@lifeforge/federation'

import { Flex } from '@/components/primitives'
import { Scrollbar } from '@/components/utilities'
import { ModuleSidebarStateProvider } from '@/providers'

/**
 * The wrapper component for all modules in the app. It provides the layout and context for the module header and sidebar, as well as handling query cleanup on unmount if specified. If being used within LifeForge instance, it will be automatically wrapped around the module content. Therefore, no explicit usage is needed in most cases.
 */
export function ModuleWrapper({
  children,
  config: { name, title, icon, clearQueryOnUnmount = true }
}: {
  children: React.ReactNode
  config: {
    name: string
    title: string
    displayName?: string
    icon: string
    clearQueryOnUnmount: boolean
  }
}) {
  const queryClient = useQueryClient()
  useEffect(() => {
    return () => {
      if (!clearQueryOnUnmount) return

      queryClient.removeQueries({
        queryKey: [_.camelCase(title)]
      })
    }
  }, [queryClient, clearQueryOnUnmount, title])

  return (
    <ModuleMetadataProvider value={{ name, title, icon }}>
      <ModuleSidebarStateProvider>
        <Flex asChild direction="column" minHeight="0">
          <Scrollbar className="no-overflow-x" usePaddingRight={false}>
            <Flex
              direction="column"
              flex="1"
              overflowX="hidden"
              pt="xl"
              px={{ base: 'md', sm: '2xl' }}
              width="100%"
            >
              {children}
            </Flex>
          </Scrollbar>
        </Flex>
      </ModuleSidebarStateProvider>
    </ModuleMetadataProvider>
  )
}
