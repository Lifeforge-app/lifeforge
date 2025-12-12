import { Combobox } from '@headlessui/react'
import clsx from 'clsx'

function ComboboxInputWrapper<T>({
  value,
  onChange,
  setQuery,
  children,
  className,
  disabled,
  onClick,
  variant = 'classic'
}: {
  value: T
  onChange: (value: T | null) => void
  setQuery: (query: string) => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  variant?: 'classic' | 'plain'
}) {
  return (
    <Combobox
      as="div"
      className={clsx(
        'relative flex cursor-text items-center gap-1 transition-all',
        variant === 'classic'
          ? 'border-bg-500 component-bg-lighter-with-hover shadow-custom focus-within:border-custom-500! data-[open]:border-custom-500! rounded-t-lg border-b-2 in-[.bordered]:rounded-lg in-[.bordered]:border-2'
          : 'component-bg-lighter-with-hover rounded-lg p-4 px-5',
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
