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
  errorMsg,
  variant = 'classic'
}: {
  value: T
  onChange: (value: T) => void
  multiple?: boolean
  className?: string
  children: React.ReactNode
  disabled?: boolean
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  errorMsg?: string
  variant?: 'classic' | 'plain'
}) {
  return (
    <div className={clsx('flex-1 space-y-2', className)}>
      <Listbox
        as="div"
        className={clsx(
          'relative flex w-full items-center gap-1 transition-all',
          variant === 'classic'
            ? 'bg-bg-200/50 shadow-custom hover:bg-bg-200 dark:bg-bg-800/50 dark:hover:bg-bg-800/80 rounded-t-lg border-b-2 in-[.bordered]:rounded-lg in-[.bordered]:border-2'
            : 'component-bg-lighter-with-hover rounded-lg p-4 px-5',
          variant === 'classic' &&
            (errorMsg
              ? 'border-red-500'
              : 'border-bg-500/30 in-[.bordered]:border-bg-500/20 focus-within:border-custom-500! data-open:border-custom-500!'),
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
