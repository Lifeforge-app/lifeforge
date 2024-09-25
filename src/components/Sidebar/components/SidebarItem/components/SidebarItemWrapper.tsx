import React from 'react'

function SidebarItemWrapper({
  active,
  children
}: {
  active: boolean
  children: React.ReactNode
}): React.ReactElement {
  return (
    <li
      className={`relative isolate flex h-16 items-center gap-6 px-4 transition-all ${
        active
          ? "font-semibold text-bg-800 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-1 after:-translate-y-1/2 after:rounded-full after:bg-custom-500 after:content-[''] dark:text-bg-50"
          : 'text-bg-500 dark:text-bg-500'
      }`}
    >
      <div
        className={`flex-between group relative flex w-full gap-6 whitespace-nowrap rounded-lg p-4 pr-3 transition-all duration-100 ${
          active
            ? 'bg-bg-200/30 shadow-custom dark:bg-bg-800/50'
            : 'hover:bg-bg-100/50 dark:hover:bg-bg-800/30'
        }`}
      >
        {children}
      </div>
    </li>
  )
}

export default SidebarItemWrapper
