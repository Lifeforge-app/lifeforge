/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useCallback } from 'react'

import {
  inputWrapperContainerStyle,
  inputWrapperErrorIconStyle,
  inputWrapperErrorTextStyle,
  inputWrapperRecipe
} from '../input.css'

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
    <div className={clsx(inputWrapperContainerStyle, className)}>
      <div
        className={clsx('group', wrapperClassName)}
        role="button"
        tabIndex={0}
        onClick={focusInput}
        onFocus={focusInput}
        onKeyDown={handleKeyDown}
      >
        {children}
        {errorMsg && (
          <Icon
            className={inputWrapperErrorIconStyle}
            icon="tabler:alert-circle"
          />
        )}
      </div>
      {errorMsg && <div className={inputWrapperErrorTextStyle}>{errorMsg}</div>}
    </div>
  )
}

export default InputWrapper
