import React from 'react'

function ModuleWrapper({
  id,
  children
}: {
  id: string
  children: React.ReactNode
}): React.ReactElement {
  return (
    <section
      id={id}
      className="flex h-full min-h-0 w-full flex-1 flex-col overflow-y-scroll px-4 sm:px-12"
    >
      {children}
    </section>
  )
}

export default ModuleWrapper
