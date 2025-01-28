import React from 'react'

function ContentWrapperWithSidebar({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  return <div className="flex h-full flex-1 flex-col lg:ml-6">{children}</div>
}

export default ContentWrapperWithSidebar
