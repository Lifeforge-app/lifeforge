import * as Select from '@radix-ui/react-select'
import clsx from 'clsx'
import { usePersonalization } from 'shared'

function ListboxOptions({
  children,
  customWidth,
  lighter = false
}: {
  children: React.ReactNode
  customWidth?: string
  lighter?: boolean
}) {
  const { rootElement } = usePersonalization()

  return (
    <Select.Portal container={rootElement}>
      <Select.Content
        className={clsx(
          customWidth ?? 'w-[var(--radix-select-trigger-width)]',
          'divide-bg-200 border-bg-200 dark:border-bg-700 z-9999 divide-y overflow-auto rounded-xl border',
          lighter ? 'bg-bg-50' : 'bg-bg-100',
          'text-bg-500 text-base shadow-lg transition duration-100 ease-out',
          'dark:divide-bg-700/50 dark:border-bg-700 dark:bg-bg-800 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 empty:invisible focus:outline-hidden'
        )}
        position="popper"
        sideOffset={12}
        onSelect={e => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <Select.Viewport className="p-[5px]">{children}</Select.Viewport>
      </Select.Content>
    </Select.Portal>
  )
}

export default ListboxOptions
