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
      className={`mx-4 flex h-full min-h-0 w-full flex-1 flex-col overflow-y-scroll sm:px-12 ${className}`}
    >
      {children}
    </section>
  )
}

export default ModuleWrapper
