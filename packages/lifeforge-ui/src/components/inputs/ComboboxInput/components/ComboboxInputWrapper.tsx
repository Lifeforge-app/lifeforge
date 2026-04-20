import { Combobox } from '@headlessui/react'
import clsx from 'clsx'

import { inputWrapperRecipe } from '@components/inputs/shared/components/InputWrapper/InputWrapper.css'
import { Flex } from '@components/primitives'

import * as styles from './ComboboxInputWrapper.css'

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
    <Flex
      asChild
      align="center"
      gap="xs"
      position="relative"
      shadow={variant === 'classic'}
      width="100%"
    >
      <Combobox
        as="div"
        className={clsx(
          inputWrapperRecipe({ variant, disabled: disabled ?? false }),
          styles.dataOpen,
          className
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
    </Flex>
  )
}

export default ComboboxInputWrapper
