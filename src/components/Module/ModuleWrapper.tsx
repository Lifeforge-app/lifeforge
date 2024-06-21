import React from 'react'
import Scrollbar from '@components/Scrollbar'

function ModuleWrapper({
  children,
  className = ''
}: {
  children: any
  className?: string
}): React.ReactElement {
  return (
    <Scrollbar className={`flex h-full min-h-0 flex-1 flex-col ${className}`}>
      <div className="flex min-h-0 flex-1 flex-col px-4 sm:px-12">
        {children}
      </div>
    </Scrollbar>
  )
}

export default ModuleWrapper
