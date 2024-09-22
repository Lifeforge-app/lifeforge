import { ListboxOptions as HeadlessListboxOptions } from '@headlessui/react'
import React from 'react'

function ListboxOptions({
  children,
  customWidth,
  lighter = false
}: {
  children: React.ReactNode
  customWidth?: string
  lighter?: boolean
}): React.ReactElement {
  return (
    <HeadlessListboxOptions
      transition
      anchor="bottom start"
      className={`${
        customWidth ?? 'w-[var(--button-width)]'
      } z-[9999] divide-y divide-bg-200 overflow-auto rounded-md border border-bg-200 dark:border-bg-700 ${
        lighter ? 'bg-bg-50' : 'bg-bg-100'
      } text-base text-bg-500 shadow-lg transition duration-100 ease-out [--anchor-gap:12px] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:divide-bg-700/50 dark:border-bg-700 dark:bg-bg-800`}
    >
      {children}
    </HeadlessListboxOptions>
  )
}

export default ListboxOptions
