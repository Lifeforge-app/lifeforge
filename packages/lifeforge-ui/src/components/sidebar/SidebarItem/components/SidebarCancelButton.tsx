import { Icon } from '@iconify/react'

function SidebarCancelButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="z-9999 text-bg-500 hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-700/50 dark:hover:text-bg-50 overscroll-contain rounded-md p-2"
      onClick={e => {
        e.stopPropagation()
        onClick()
      }}
    >
      <Icon className="size-5" icon="tabler:x" />
    </button>
  )
}

export default SidebarCancelButton
