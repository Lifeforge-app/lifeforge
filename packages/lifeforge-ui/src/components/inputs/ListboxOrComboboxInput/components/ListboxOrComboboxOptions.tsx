import {
  ComboboxOptions as HeadlessComboBoxOptions,
  ListboxOptions as HeadlessListboxOptions
} from '@headlessui/react'
import clsx from 'clsx'

function ListboxOrComboboxOptions({
  type = 'listbox',
  children,
  customWidth,
  lighter = false
}: {
  type?: 'listbox' | 'combobox'
  children: React.ReactNode
  customWidth?: string
  lighter?: boolean
}) {
  const Element =
    type === 'listbox' ? HeadlessListboxOptions : HeadlessComboBoxOptions

  return (
    <Element
      transition
      anchor="bottom start"
      className={clsx(
        customWidth ??
          (type === 'listbox'
            ? 'w-[var(--button-width)]'
            : 'w-[var(--input-width)]'),
        'divide-bg-200 border-bg-200 dark:border-bg-700 z-9999 divide-y overflow-auto rounded-md border',
        lighter ? 'bg-bg-50' : 'bg-bg-100',
        'text-bg-500 text-base shadow-lg transition duration-100 ease-out',
        type === 'listbox' ? '[--anchor-gap:12px]' : '[--anchor-gap:22px]',
        'dark:divide-bg-700/50 dark:border-bg-700 dark:bg-bg-800 empty:invisible focus:outline-hidden data-closed:scale-95 data-closed:opacity-0'
      )}
    >
      {children}
    </Element>
  )
}

export default ListboxOrComboboxOptions
