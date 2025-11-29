import { Icon } from '@iconify/react'

import { useModuleSidebarState } from '@components/layout'

function SidebarActionButton({
  icon,
  onClick
}: {
  icon: string
  onClick: () => void
}) {
  const { setIsSidebarOpen } = useModuleSidebarState()

  return (
    <button
      className="hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-700/50 dark:hover:text-bg-50 pointer-events-none z-9999 overscroll-contain rounded-md p-2 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100"
      onClick={e => {
        e.stopPropagation()
        onClick()
        setIsSidebarOpen(false)
      }}
    >
      <Icon className="size-5" icon={icon} />
    </button>
  )
}

export default SidebarActionButton
