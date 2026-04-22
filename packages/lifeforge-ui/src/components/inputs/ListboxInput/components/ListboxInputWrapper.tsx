import { Listbox } from '@headlessui/react'
import { Icon } from '@iconify/react'
import clsx from 'clsx'

import { inputWrapperRecipe } from '@components/inputs/shared/components/InputWrapper/InputWrapper.css'
import { InputFocusProvider } from '@components/inputs/shared/contexts/InputFocusContext'
import { Box, Flex, Text } from '@components/primitives'

import type { InputSize, InputVariant } from '../../shared/types'
import useListboxBlurOnClose from '../hooks/useListboxBlurOnClose'
import * as styles from './ListboxInputWrapper.css'

function ListboxInputWrapper<T>({
  value,
  onChange,
  multiple = false,
  className,
  children,
  disabled,
  onClick,
  errorMsg,
  variant = 'classic',
  size
}: {
  value: T
  onChange: (value: T) => void
  multiple?: boolean
  className?: string
  children: React.ReactNode
  disabled?: boolean
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  errorMsg?: string
  variant?: InputVariant
  size?: InputSize
}) {
  const listboxRef = useListboxBlurOnClose()

  return (
    <InputFocusProvider>
      <Flex
        className={className}
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
              ? { outline: '2px solid var(--color-red-500)' }
              : {}
          }
          width="100%"
        >
          <Listbox
            ref={listboxRef}
            as="div"
            className={clsx(
              !errorMsg && styles.dataOpen,
              inputWrapperRecipe({
                variant,
                size: size ?? 'default',
                hasError: !!errorMsg,
                disabled: disabled ?? false
              })
            )}
            multiple={multiple}
            style={{
              padding: 0
            }}
            value={value}
            onChange={onChange}
            onClick={onClick}
          >
            {children}
            {errorMsg && (
              <Box
                asChild
                flexShrink="0"
                mr={variant === 'classic' ? 'lg' : 'md'}
              >
                <Icon
                  color="var(--color-red-500)"
                  height="1.5em"
                  icon="tabler:alert-circle"
                  width="1.5em"
                />
              </Box>
            )}
          </Listbox>
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

export default ListboxInputWrapper
