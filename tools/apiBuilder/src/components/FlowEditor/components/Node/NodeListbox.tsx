import { Listbox, ListboxButton, ListboxOptions } from '@headlessui/react'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

type NodeListboxProps<T> =
  | {
      multiple: true
      value: T[]
      setValue: (value: T[]) => void
      buttonContent?: React.ReactNode
      children?: React.ReactNode
    }
  | {
      multiple?: false
      value: T
      setValue: (value: T) => void
      buttonContent?: React.ReactNode
      children?: React.ReactNode
    }

function NodeListbox<T>({
  value,
  setValue,
  buttonContent,
  children,
  multiple
}: NodeListboxProps<T>) {
  const { t } = useTranslation('apps.apiBuilder')

  return (
    <Listbox
      multiple={multiple}
      value={value as T}
      onChange={setValue as (value: T) => void}
    >
      <ListboxButton className="border-bg-200 dark:border-bg-800 component-bg-lighter flex-between h-10 w-full gap-3 rounded-md border pr-2 pl-3">
        <div className="text-bg-600 dark:text-bg-400 w-full min-w-0 truncate text-left">
          {!value ||
          (Array.isArray(value) && value.length === 0) ||
          JSON.stringify(value) === '{}' ? (
            <span className="text-bg-400 dark:text-bg-600">
              {t('empty.pleaseSelect')}
            </span>
          ) : (
            buttonContent || (
              <span>
                {multiple ? value.join(', ') : JSON.stringify(value ?? {})}
              </span>
            )
          )}
        </div>
        <Icon
          className="text-bg-400 dark:text-bg-600"
          icon="tabler:chevron-down"
        />
      </ListboxButton>
      <ListboxOptions
        transition
        anchor="bottom"
        className={clsx(
          'border-bg-200 dark:border-bg-700 bg-bg-100 dark:bg-bg-800 shadow-custom min-w-[max(var(--button-width),16rem)] rounded-lg border p-1 [--anchor-gap:--spacing(2)] focus:outline-none',
          'transition duration-100 ease-in data-leave:data-closed:opacity-0'
        )}
      >
        {children}
      </ListboxOptions>
    </Listbox>
  )
}

export default NodeListbox
