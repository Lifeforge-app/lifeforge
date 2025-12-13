import { ListboxOptions as HeadlessListboxOptions } from '@headlessui/react'
import clsx from 'clsx'

function ListboxOptions({
  children,
  customWidth,
  lighter = false
}: {
  children: React.ReactNode
  customWidth?: string
  lighter?: boolean
}) {
  return (
    <HeadlessListboxOptions
      transition
      className={clsx(
        customWidth ?? 'w-[var(--button-width)]',
        'divide-bg-200 border-bg-200 dark:border-bg-700 z-99 divide-y overflow-auto rounded-md border',
        lighter ? 'bg-bg-50' : 'bg-bg-100',
        'text-bg-500 absolute top-22 left-0 text-base shadow-lg transition duration-100 ease-out [--anchor-gap:12px]',
        'dark:divide-bg-700/50 dark:border-bg-700 dark:bg-bg-800 empty:invisible focus:outline-hidden data-closed:scale-95 data-closed:opacity-0'
      )}
      portal={false}
    >
      {children}
    </HeadlessListboxOptions>
  )
}

export default ListboxOptions
