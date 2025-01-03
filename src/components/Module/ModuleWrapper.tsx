import React from 'react'
import Scrollbar from '@components/Miscellaneous/Scrollbar'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'

function ModuleWrapper({
  children,
  className = ''
}: {
  children: any
  className?: string
}): React.ReactElement {
  const { subSidebarExpanded } = useGlobalStateContext()

  return (
    <Scrollbar
      className={`absolute ${
        subSidebarExpanded
          ? 'top-0'
          : 'top-20 !h-[calc(100%-5rem)] sm:top-28 sm:!h-[calc(100%-7rem)]'
      } no-overflow-x flex min-h-0 flex-col transition-all ${className}`}
    >
      <div
        className={`flex w-full flex-1 flex-col px-4 sm:px-12 ${
          subSidebarExpanded && 'pt-8'
        }`}
      >
        {children}
      </div>
    </Scrollbar>
  )
}

export default ModuleWrapper
