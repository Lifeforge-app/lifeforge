import { Icon } from '@iconify/react'

import { useModuleSidebarState } from '@components/layouts'

function SidebarCancelButton({ onClick }: { onClick: () => void }) {
  const { setIsSidebarOpen } = useModuleSidebarState()

  return (
    <button
      className="text-bg-500 hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-700/50 dark:hover:text-bg-50 z-9999 overscroll-contain rounded-md p-2"
      onClick={e => {
        e.stopPropagation()
        onClick()
        setIsSidebarOpen(false)
      }}
    >
      <Icon className="size-5" icon="tabler:x" />
    </button>
  )
}

export default SidebarCancelButton
