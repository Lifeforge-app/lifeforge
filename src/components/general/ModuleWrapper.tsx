import React from 'react'

function ModuleWrapper({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col overflow-y-scroll px-8 sm:px-12">
      {children}
    </section>
  )
}

export default ModuleWrapper
