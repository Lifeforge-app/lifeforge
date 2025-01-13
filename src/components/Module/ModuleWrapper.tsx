import React from 'react'
import Scrollbar from '@components/Miscellaneous/Scrollbar'

function ModuleWrapper({
  children,
  className = ''
}: {
  children: any
  className?: string
}): React.ReactElement {
  return (
    <Scrollbar
      className={`no-overflow-x flex min-h-0 flex-col transition-all ${className}`}
    >
      <div className="flex w-full flex-1 flex-col px-4 pt-8 sm:px-12">
        {children}
      </div>
    </Scrollbar>
  )
}

export default ModuleWrapper
