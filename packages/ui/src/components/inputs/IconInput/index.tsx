import { useCallback, useRef } from 'react'

import { Box, Flex } from '@/components/primitives'
import { useModalStore } from '@/providers'

import { InputActionButton } from '../shared/components/InputActionButton'
import { InputIcon } from '../shared/components/InputIcon'
import { InputInnerWrapper } from '../shared/components/InputInnerWrapper'
import { InputLabel } from '../shared/components/InputLabel'
import { InputWrapper } from '../shared/components/InputWrapper'
import { Placeholder } from '../shared/components/Placeholder'
import { useInputLabel } from '../shared/hooks/useInputLabel'
import type { InputVariants } from '../shared/types'
import { autoFocusableRef } from '../shared/utils/autoFocusableRef'
import { IconPickerModal } from './IconPickerModal'
import { IconPreview } from './components/IconPreview'

export interface IconInputProps {
  label?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  disabled?: boolean
  autoFocus?: boolean
  namespace?: string | false
  errorMsg?: string
}

export function IconInput({
  variant = 'classic',
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  autoFocus = false,
  namespace,
  errorMsg
}: IconInputProps & InputVariants) {
  const { open } = useModalStore()
  const inputLabel = useInputLabel({ namespace, label: label ?? '' })
  const ref = useRef<HTMLInputElement>(null)

  const handleIconSelectorOpen = useCallback(() => {
    open(IconPickerModal, { setSelectedIcon: onChange })
  }, [open, onChange])

  return (
    <InputWrapper
      disabled={disabled}
      errorMsg={errorMsg}
      inputRef={ref}
      variant={variant}
    >
      {variant === 'classic' && (
        <InputIcon active={!!value} hasError={!!errorMsg} icon="tabler:icons" />
      )}
      <Flex align="center" gap="sm" position="relative" width="100%">
        {variant === 'classic' && label && (
          <Box asChild pr="3xl">
            <InputLabel
              active={!!value}
              hasError={!!errorMsg}
              label={inputLabel}
              required={required}
            />
          </Box>
        )}
        <InputInnerWrapper
          hasActionButton
          gap={variant === 'classic' ? 'sm' : 'md'}
          variant={variant}
        >
          <IconPreview value={value} variant={variant} />
          <Placeholder
            color={variant === 'classic' ? 'transparent' : 'default'}
            focusColor="default"
          >
            <Box asChild width="100%">
              <input
                ref={autoFocusableRef(autoFocus, ref)}
                autoComplete="off"
                disabled={disabled}
                name={label}
                placeholder="tabler:cube"
                value={value}
                onBlur={e => {
                  onChange(e.target.value.trim())
                }}
                onChange={e => onChange(e.target.value)}
              />
            </Box>
          </Placeholder>
        </InputInnerWrapper>
      </Flex>
      <InputActionButton
        hasError={!!errorMsg}
        icon="heroicons:chevron-up-down-16-solid"
        variant={variant}
        onClick={handleIconSelectorOpen}
      />
    </InputWrapper>
  )
}
