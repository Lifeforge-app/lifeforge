import React from 'react'

function SidebarDivider({
  noMargin = false
}: {
  noMargin?: boolean
}): React.ReactElement {
  return (
    <li
      className={`${
        !noMargin && 'my-4'
      } h-px shrink-0 bg-bg-200 dark:bg-bg-700`}
    />
  )
}

export default SidebarDivider
