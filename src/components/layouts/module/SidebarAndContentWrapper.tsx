import React from 'react'

function SidebarAndContentWrapper({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  return <div className="mt-6 flex min-h-0 w-full flex-1">{children}</div>
}

export default SidebarAndContentWrapper
