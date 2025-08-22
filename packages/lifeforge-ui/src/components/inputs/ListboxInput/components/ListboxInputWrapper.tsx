import { Listbox } from '@headlessui/react'
import clsx from 'clsx'

function ListboxInputWrapper<T>({
  value,
  onChange,
  multiple = false,
  className,
  children,
  disabled,
  onClick,
  errorMsg
}: {
  value: T
  onChange: (value: T) => void
  multiple?: boolean
  className?: string
  children: React.ReactNode
  disabled?: boolean
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  errorMsg?: string
}) {
  return (
    <div className="flex-1 space-y-2">
      <Listbox
        as="div"
        className={clsx(
          'bg-bg-200/50 shadow-custom hover:bg-bg-200 dark:bg-bg-800/50 dark:hover:bg-bg-800/80 relative flex items-center gap-1 rounded-t-lg border-b-2 transition-all',
          errorMsg
            ? 'border-red-500'
            : 'border-bg-500 focus-within:border-custom-500! data-open:border-custom-500!',
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
      {errorMsg && <div className="px-6 text-sm text-red-500">{errorMsg}</div>}
    </div>
  )
}

export default ListboxInputWrapper
