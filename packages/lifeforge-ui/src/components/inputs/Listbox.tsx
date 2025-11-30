import { Listbox as HeadlessListbox, ListboxButton } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { clsx } from 'clsx'

import ListboxOptions from './ListboxInput/components/ListboxOptions'

/**
 * A listbox component for selecting from a list of options. Similar to ListboxInput but without the input box styling.
 */
function Listbox<T>({
  value,
  onChange,
  buttonContent,
  children,
  className
}: {
  value: T
  onChange: (value: T) => void
  buttonContent: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <HeadlessListbox value={value} onChange={onChange}>
      <ListboxButton
        className={clsx(
          'shadow-custom component-bg-with-hover flex-between w-full min-w-0 gap-6 rounded-lg p-4 text-left outline-hidden transition-all focus:outline-hidden',
          className
        )}
      >
        <div className="w-full min-w-0 truncate">{buttonContent}</div>
        <Icon
          className="text-bg-500 size-5 shrink-0"
          icon="tabler:chevron-down"
        />
      </ListboxButton>
      <ListboxOptions>{children}</ListboxOptions>
    </HeadlessListbox>
  )
}

export default Listbox
