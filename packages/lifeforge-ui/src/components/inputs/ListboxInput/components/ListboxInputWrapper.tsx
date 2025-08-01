import { Listbox } from '@headlessui/react'
import clsx from 'clsx'

function ListboxInputWrapper<T>({
  value,
  onChange,
  multiple = false,
  className,
  children,
  disabled,
  onClick
}: {
  value: T
  onChange: (value: T) => void
  multiple?: boolean
  className?: string
  children: React.ReactNode
  disabled?: boolean
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}) {
  return (
    <Listbox
      as="div"
      className={clsx(
        'border-bg-400 dark:border-bg-600 bg-bg-200/50 shadow-custom hover:bg-bg-200 focus-within:border-custom-500! data-open:border-custom-500! dark:bg-bg-800/50 dark:hover:bg-bg-800/80 relative flex items-center gap-1 rounded-t-lg border-b-2 transition-all',
        className,
        disabled ? 'pointer-events-none! opacity-50' : ''
      )}
      multiple={multiple}
      value={value}
      onChange={onChange}
      onClick={onClick}
    >
      {children}
    </Listbox>
  )
}

export default ListboxInputWrapper
