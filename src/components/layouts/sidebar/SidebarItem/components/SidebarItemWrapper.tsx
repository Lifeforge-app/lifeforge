import React from 'react'

function SidebarItemWrapper({
  active,
  children,
  onClick
}: {
  active: boolean
  children: React.ReactNode
  onClick?: () => void
}): React.ReactElement {
  return (
    <li
      className={`flex-center relative isolate px-4 transition-all ${
        active
          ? "font-semibold text-bg-800 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-1 after:-translate-y-1/2 after:rounded-full after:bg-custom-500 after:content-[''] dark:text-bg-50"
          : 'text-bg-500 dark:text-bg-500'
      }`}
    >
      <div
        className={`flex-between cursor-pointer text-left group relative flex h-14 w-full gap-4 whitespace-nowrap rounded-lg pl-4 pr-3 transition-all duration-100 ${
          active
            ? 'bg-bg-200/50 shadow-custom dark:bg-bg-800'
            : 'hover:bg-bg-200/30 dark:hover:bg-bg-800/30'
        }`}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onClick?.()
          }
        }}
      >
        {children}
      </div>
    </li>
  )
}

export default SidebarItemWrapper
