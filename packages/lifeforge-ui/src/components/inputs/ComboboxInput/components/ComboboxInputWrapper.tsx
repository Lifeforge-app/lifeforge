import { Combobox } from '@headlessui/react'
import { Icon } from '@iconify/react'
import clsx from 'clsx'

import { inputWrapperRecipe } from '@components/inputs/shared/components/InputWrapper/InputWrapper.css'
import { InputFocusProvider } from '@components/inputs/shared/contexts/InputFocusContext'
import { Box, Flex, Text } from '@components/primitives'

import * as styles from './ComboboxInputWrapper.css'
import type { InputVariant } from '@components/inputs/shared/types'

export function ComboboxInputWrapper<T>({
  value,
  onChange,
  setQuery,
  children,
  className,
  disabled,
  onClick,
  errorMsg,
  variant = 'classic'
}: {
  value: T
  onChange: (value: T | null) => void
  setQuery: (query: string) => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  errorMsg?: string
  variant?: InputVariant
}) {
  return (
    <InputFocusProvider>
    <Flex
      direction="column"
      gap="sm"
      style={disabled ? { opacity: 0.5 } : undefined}
      width="100%"
    >
      <Flex
        asChild
        align="center"
        gap="xs"
        position="relative"
        shadow={variant === 'classic'}
        style={
          variant === 'plain' && errorMsg
            ? { outline: '2px solid var(--color-dangerous)' }
            : {}
        }
        width="100%"
      >
        <Combobox
          as="div"
          className={clsx(
            inputWrapperRecipe({
              variant,
              hasError: !!errorMsg,
              disabled: disabled ?? false
            }),
            styles.dataOpen,
            className
          )}
          style={{ padding: 0 }}
          value={value}
          onChange={onChange}
          onClick={onClick}
          onClose={() => {
            setQuery('')
          }}
        >
          {children}
          {errorMsg && (
            <Box
              asChild
              flexShrink="0"
              mr={variant === 'classic' ? 'lg' : 'md'}
            >
              <Icon
                color="var(--color-dangerous)"
                height="1.5em"
                icon="tabler:alert-circle"
                width="1.5em"
              />
            </Box>
          )}
        </Combobox>
      </Flex>
      {errorMsg && (
        <Text color="dangerous" px="md" size="sm">
          {errorMsg}
        </Text>
      )}
    </Flex>
    </InputFocusProvider>
  )
}

