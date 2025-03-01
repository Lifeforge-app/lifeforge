import {
  ListboxOptions as HeadlessListboxOptions,
  ComboboxOptions as HeadlessComboBoxOptions
} from '@headlessui/react'
import clsx from 'clsx'
import React from 'react'

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
}): React.ReactElement {
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
        'z-9999 divide-y divide-bg-200 overflow-auto rounded-md border border-bg-200 dark:border-bg-700',
        lighter ? 'bg-bg-50' : 'bg-bg-100',
        'text-base text-bg-500 shadow-lg transition duration-100 ease-out',
        type === 'listbox' ? '[--anchor-gap:12px]' : '[--anchor-gap:22px]',
        'empty:invisible focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 dark:divide-bg-700/50 dark:border-bg-700 dark:bg-bg-800'
      )}
    >
      {children}
    </Element>
  )
}

export default ListboxOrComboboxOptions
