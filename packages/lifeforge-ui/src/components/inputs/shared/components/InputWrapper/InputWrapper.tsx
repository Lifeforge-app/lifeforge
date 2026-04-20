/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useCallback } from 'react'

import { Box, Flex, Text } from '@components/primitives'

import {
  inputWrapperErrorTextStyle,
  inputWrapperRecipe
} from './InputWrapper.css'

function InputWrapper({
  className = '',
  variant = 'classic',
  size = 'default',
  disabled = false,
  inputRef,
  onFocus,
  children,
  errorMsg
}: {
  variant?: 'classic' | 'plain'
  size?: 'small' | 'default'
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
    <Flex className={className} direction="column" gap="sm" width="100%">
      <Flex
        shadow
        align="center"
        className={clsx('group', wrapperClassName)}
        flexShrink="0"
        position="relative"
        role="button"
        tabIndex={0}
        width="100%"
        onClick={focusInput}
        onFocus={focusInput}
        onKeyDown={handleKeyDown}
      >
        {children}
        {errorMsg && (
          <Box asChild mr="lg">
            <Icon
              color="var(--color-red-500)"
              height="1.5em"
              icon="tabler:alert-circle"
              width="1.5em"
            />
          </Box>
        )}
      </Flex>
      {errorMsg && (
        <Text
          className={inputWrapperErrorTextStyle}
          color="dangerous"
          display="block"
          px="lg"
          size="sm"
        >
          {errorMsg}
        </Text>
      )}
    </Flex>
  )
}

export default InputWrapper
