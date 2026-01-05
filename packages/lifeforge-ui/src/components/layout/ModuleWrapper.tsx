import { useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'
import { useEffect } from 'react'
import { normalizeSubnamespace } from 'shared'

import { Scrollbar } from '@components/utilities'

import { ModuleHeaderStateContext } from './ModuleHeaderStateProvider'
import ModuleSidebarStateProvider from './ModuleSidebarStateProvider'

function ModuleWrapper({
  children,
  config: { title, displayName, icon, clearQueryOnUnmount = true }
}: {
  children: React.ReactNode
  config: {
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
    <ModuleHeaderStateContext
      value={{ title: normalizeSubnamespace(title).replace('__', '$'), icon }}
    >
      <ModuleSidebarStateProvider>
        <Scrollbar
          className="no-overflow-x flex min-h-0 flex-col transition-all"
          usePaddingRight={false}
        >
          <div className="flex w-full flex-1 flex-col px-4 pt-8 sm:px-12">
            {children}
          </div>
        </Scrollbar>
      </ModuleSidebarStateProvider>
    </ModuleHeaderStateContext>
  )
}

export default ModuleWrapper
