/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react'

import { Box, Flex, Icon, Text, Transition } from '@/components/primitives'
import { colorWithOpacity } from '@/system'

import { InputFocusProvider } from '../../contexts/InputFocusContext'
import type { InputSize, InputVariant } from '../../types'
import {
  inputWrapperErrorTextStyle,
  inputWrapperRecipe
} from './InputWrapper.css'

export function InputWrapper({
  className = '',
  variant = 'classic',
  size = 'default',
  disabled = false,
  inputRef,
  onFocus,
  children,
  errorMsg
}: {
  variant?: InputVariant
  size?: InputSize
  className?: string
  disabled?: boolean
  inputRef?: React.RefObject<any | null>
  onFocus?: () => void
  children: React.ReactNode
  errorMsg?: string
}) {
  const focusInput = useCallback(
    (e: React.MouseEvent | React.FocusEvent) => {
      if ((e.target as HTMLElement).tagName === 'BUTTON') {
        return
      }

      if (inputRef?.current !== undefined && inputRef.current !== null) {
        inputRef.current.focus()

        if (
          !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)
        ) {
          inputRef.current.setSelectionRange(
            inputRef.current.value.length,
            inputRef.current.value.length
          )
        }
      }

      onFocus?.()
    },
    [inputRef, onFocus]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()

        if (inputRef?.current !== undefined && inputRef.current !== null) {
          inputRef.current.focus()
        }
      }
    },
    [inputRef]
  )

  const wrapperClassName = inputWrapperRecipe({
    variant,
    size,
    hasError: !!errorMsg,
    disabled
  })

  return (
    <InputFocusProvider>
      <Flex
        className={className}
        direction="column"
        gap="sm"
        minWidth="0"
        style={disabled ? { opacity: 0.5 } : undefined}
        width="100%"
      >
        <Transition>
          <Flex
            shadow
            align="center"
            bg={{
              base: colorWithOpacity('bg-200', '50%'),
              dark: colorWithOpacity('bg-800', '70%'),
              hover: 'bg-200',
              darkHover: 'bg-800'
            }}
            className={wrapperClassName}
            flexShrink="0"
            minWidth="0"
            position="relative"
            role="button"
            style={
              variant === 'plain' && errorMsg
                ? { outline: '2px solid var(--color-dangerous)' }
                : {}
            }
            tabIndex={0}
            width="100%"
            onClick={focusInput}
            onFocus={focusInput}
            onKeyDown={handleKeyDown}
          >
            {children}
            {errorMsg && (
              <Box
                asChild
                flexShrink="0"
                mr={variant === 'classic' ? 'lg' : undefined}
              >
                <Icon
                  color="dangerous"
                  icon="tabler:alert-circle"
                  size="1.5em"
                />
              </Box>
            )}
          </Flex>
        </Transition>
        {errorMsg && (
          <Text
            className={inputWrapperErrorTextStyle}
            color="dangerous"
            display="block"
            px={variant === 'classic' ? 'md' : undefined}
            size="sm"
          >
            {errorMsg}
          </Text>
        )}
      </Flex>
    </InputFocusProvider>
  )
}
