/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useCallback } from 'react'

import { Box, Flex } from '@components/primitives'

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
    <Flex className={className} width="100%" direction="column" gap="sm">
      <Flex
        align="center"
        className={clsx('group', wrapperClassName)}
        flexShrink="0"
        gap="sm"
        position="relative"
        role="button"
        style={{
          transition: 'all 0.2s'
        }}
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
      {errorMsg && <div className={inputWrapperErrorTextStyle}>{errorMsg}</div>}
    </Flex>
  )
}

export default InputWrapper
