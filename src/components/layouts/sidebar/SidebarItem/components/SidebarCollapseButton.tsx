import React from 'react'
import { Button } from '@components/buttons'

function SidebarCollapseButton({
  onClick,
  isCollapsed
}: {
  onClick: () => void
  isCollapsed: boolean
}): React.ReactElement {
  return (
    <Button
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}
      variant="no-bg"
      className="p-2!"
      iconClassName={`transition ${isCollapsed ? 'rotate-180' : ''}`}
      icon="tabler:chevron-down"
    />
  )
}

export default SidebarCollapseButton
