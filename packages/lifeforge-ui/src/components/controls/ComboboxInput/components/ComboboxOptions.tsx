import { ComboboxOptions as HeadlessComboBoxOptions } from '@headlessui/react'
import clsx from 'clsx'

function ComboboxOptions({
  children,
  customWidth,
  lighter = false
}: {
  children: React.ReactNode
  customWidth?: string
  lighter?: boolean
}) {
  return (
    <HeadlessComboBoxOptions
      transition
      anchor="bottom start"
      className={clsx(
        customWidth ?? 'w-[var(--input-width)]',
        'divide-bg-200 border-bg-200 dark:border-bg-700 z-9999 divide-y overflow-auto rounded-md border',
        lighter ? 'bg-bg-50' : 'bg-bg-100',
        'text-bg-500 dark:divide-bg-700/50 dark:border-bg-700 dark:bg-bg-800 text-base shadow-lg transition duration-100 ease-out [--anchor-gap:22px] empty:invisible focus:outline-hidden data-closed:scale-95 data-closed:opacity-0'
      )}
    >
      {children}
    </HeadlessComboBoxOptions>
  )
}

export default ComboboxOptions
