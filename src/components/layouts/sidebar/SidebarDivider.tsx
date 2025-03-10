import clsx from 'clsx'
import React from 'react'

function SidebarDivider({
  noMargin = false
}: {
  noMargin?: boolean
}): React.ReactElement {
  return (
    <li
      className={clsx(
        'bg-bg-200 dark:bg-bg-700/50 h-px shrink-0',
        !noMargin && 'my-4'
      )}
    />
  )
}

export default SidebarDivider
