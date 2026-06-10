import { useRef, useState } from 'react'

import { Bordered, Box, Flex, Icon, Text } from '@/components/primitives'
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
import { ColorPickerModal } from './ColorPickerModal'

export interface ColorInputProps {
  /** The label text displayed above the color input field. Required for 'classic' style. */
  label?: string
  /** The current color value in hex format (e.g., "#FF0000"). */
  value: string
  /** Callback function called when the color value changes. */
  onChange: (value: string) => void
  /** Whether the color input field is required for form validation. */
  required?: boolean
  /** Whether the color input field is disabled and non-interactive. */
  disabled?: boolean
  /** Whether the input should automatically focus when rendered. */
  autoFocus?: boolean
  /** Additional CSS class names to apply to the color input component. */
  className?: string
  /** The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
  namespace?: string
  /** Error message to display when the input is invalid. */
  errorMsg?: string
}

export function ColorInput({
  variant = 'classic',
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  autoFocus = false,
  className,
  namespace,
  errorMsg
}: ColorInputProps & InputVariants) {
  const { open } = useModalStore()
  const inputLabel = useInputLabel({ namespace, label: label ?? '' })
  const ref = useRef<HTMLInputElement | null>(null)
  const [focused, setFocused] = useState(false)

  return (
    <InputWrapper
      className={className}
      disabled={disabled}
      errorMsg={errorMsg}
      inputRef={ref}
      variant={variant}
    >
      {variant === 'classic' && (
        <InputIcon
          active={value !== ''}
          hasError={!!errorMsg}
          icon="tabler:palette"
        />
      )}
      <Flex align="center" gap="sm" position="relative" width="100%">
        {variant === 'classic' && label && (
          <InputLabel
            active={!!value}
            hasError={!!errorMsg}
            label={inputLabel}
            required={required}
          />
        )}
        <InputInnerWrapper
          hasActionButton
          gap={variant === 'classic' ? 'sm' : 'md'}
          variant={variant}
        >
          {(focused || value !== '') && (
            <Bordered
              borderColor={{ base: 'bg-300', dark: 'bg-700' }}
              borderStyle="solid"
              borderWidth="1px"
              flexShrink="0"
              height={variant === 'plain' ? '1.5em' : '1em'}
              r="full"
              style={{
                marginTop: '0.125rem',
                backgroundColor: value?.match(/^#[0-9A-F]{6}$/i)
                  ? value
                  : undefined
              }}
              width={variant === 'plain' ? '1.5em' : '1em'}
            />
          )}
          <Flex align="center" gap="xs" position="relative" width="100%">
            {(focused || value !== '') && (
              <Text asChild color={{ base: 'bg-400', dark: 'bg-600' }}>
                <Icon icon="tabler:hash" />
              </Text>
            )}
            <Placeholder
              color={variant === 'classic' ? 'transparent' : 'default'}
              focusColor="default"
            >
              <Box asChild minWidth="7em" width="100%">
                <Text asChild tracking="wider">
                  <input
                    ref={autoFocusableRef(autoFocus, ref)}
                    placeholder="A9D066"
                    value={value.replace(/^#/, '')}
                    onBlur={() => setFocused(false)}
                    onChange={e => {
                      if (!e.target.value.trim()) {
                        onChange('')

                        return
                      }

                      onChange('#' + e.target.value.trim().toUpperCase())
                    }}
                    onFocus={() => setFocused(true)}
                  />
                </Text>
              </Box>
            </Placeholder>
          </Flex>
        </InputInnerWrapper>
      </Flex>
      <InputActionButton
        hasError={!!errorMsg}
        icon="tabler:color-picker"
        variant={variant}
        onClick={() => {
          open(ColorPickerModal, {
            value,
            onChange
          })
        }}
      />
    </InputWrapper>
  )
}
