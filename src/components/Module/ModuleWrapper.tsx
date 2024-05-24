import React from 'react'

function ModuleWrapper({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}): React.ReactElement {
  return (
    <section
      className={`flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-y-scroll px-4 sm:px-12 ${className}`}
    >
      {children}
    </section>
  )
}

export default ModuleWrapper
