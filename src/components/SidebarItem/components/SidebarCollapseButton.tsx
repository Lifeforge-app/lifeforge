import clsx from 'clsx'
import React from 'react'

import { Button } from '@lifeforge/ui'

function SidebarCollapseButton({
  onClick,
  isCollapsed
}: {
  onClick: () => void
  isCollapsed: boolean
}): React.ReactElement {
  return (
    <Button
      className="p-2!"
      icon="tabler:chevron-down"
      iconClassName={clsx('transition', isCollapsed && 'rotate-180')}
      variant="no-bg"
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}
    />
  )
}

export default SidebarCollapseButton
