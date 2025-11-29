import { Combobox } from '@headlessui/react'
import clsx from 'clsx'

function ComboboxInputWrapper<T>({
  value,
  onChange,
  setQuery,
  children,
  className,
  disabled,
  onClick
}: {
  value: T
  onChange: (value: T | null) => void
  setQuery: (query: string) => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}) {
  return (
    <Combobox
      as="div"
      className={clsx(
        'border-bg-500 bg-bg-200/50 shadow-custom focus-within:border-custom-500! hover:bg-bg-200 data-[open]:border-custom-500! dark:bg-bg-800/50 dark:hover:bg-bg-800/80 relative flex cursor-text items-center gap-1 rounded-t-lg border-b-2 transition-all',
        className,
        disabled ? 'pointer-events-none! opacity-50' : ''
      )}
      value={value}
      onChange={onChange}
      onClick={onClick}
      onClose={() => {
        setQuery('')
      }}
    >
      {children}
    </Combobox>
  )
}

export default ComboboxInputWrapper
