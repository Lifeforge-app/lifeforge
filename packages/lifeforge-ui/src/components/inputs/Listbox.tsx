import { Icon } from '@iconify/react/dist/iconify.js'
import * as Select from '@radix-ui/react-select'
import { clsx } from 'clsx'

import ListboxContext from './ListboxInput/components/ListboxContext'
import ListboxOptions from './ListboxInput/components/ListboxOptions'

function Listbox<T>({
  value,
  setValue,
  buttonContent,
  children,
  className
}: {
  value: T
  setValue: (value: T) => void
  buttonContent: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <ListboxContext
      value={{
        currentValue: value,
        multiple: false
      }}
    >
      <Select.Root
        value={value as string}
        onValueChange={newValue => setValue(newValue as T)}
      >
        <Select.Trigger
          className={clsx(
            'shadow-custom component-bg-lighter-with-hover flex-between w-full min-w-0 gap-6 rounded-lg p-5 text-left outline-hidden transition-all focus:outline-hidden',
            className
          )}
        >
          <div className="w-full min-w-0 truncate">{buttonContent}</div>
          <Select.Icon asChild>
            <Icon
              className="text-bg-500 size-5 shrink-0"
              icon="tabler:chevron-down"
            />
          </Select.Icon>
        </Select.Trigger>
        <ListboxOptions>{children}</ListboxOptions>
      </Select.Root>
    </ListboxContext>
  )
}

export default Listbox
