import { Scrollbar } from '@components/utilities'

import { ModuleHeaderStateContext } from './ModuleHeaderStateProvider'
import ModuleSidebarStateProvider from './ModuleSidebarStateProvider'

function ModuleWrapper({
  children,
  config
}: {
  children: React.ReactNode
  config: {
    title: string
    icon: string
  }
}) {
  return (
    <ModuleHeaderStateContext value={config}>
      <ModuleSidebarStateProvider>
        <Scrollbar className="no-overflow-x flex min-h-0 flex-col transition-all">
          <div className="flex w-full flex-1 flex-col px-4 pt-8 sm:px-12">
            {children}
          </div>
        </Scrollbar>
      </ModuleSidebarStateProvider>
    </ModuleHeaderStateContext>
  )
}

export default ModuleWrapper
