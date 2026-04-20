import { useRef } from 'react'

import { useModalStore } from '@components/overlays'
import { Bordered, Box, Flex, Text } from '@components/primitives'

import InputActionButton from '../shared/components/InputActionButton'
import InputIcon from '../shared/components/InputIcon'
import InputLabel from '../shared/components/InputLabel'
import InputWrapper from '../shared/components/InputWrapper'
import Placeholder from '../shared/components/Placeholder'
import useInputLabel from '../shared/hooks/useInputLabel'
import { autoFocusableRef } from '../shared/utils/autoFocusableRef'
import { colorDot } from './ColorInput.css'
import ColorPickerModal from './ColorPickerModal'

interface ColorInputProps {
  /** The style type of the input field. 'classic' shows label and icon with underline, 'plain' is a simple rounded box. */
  variant?: 'classic' | 'plain'
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

function ColorInput({
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
}: ColorInputProps) {
  const { open } = useModalStore()

  const inputLabel = useInputLabel({ namespace, label: label ?? '' })

  const ref = useRef<HTMLInputElement | null>(null)

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
        <Flex
          align="center"
          gap="sm"
          pb={variant === 'classic' ? 'sm' : undefined}
          pl={variant === 'classic' ? 'none' : undefined}
          pr={variant === 'classic' ? 'md' : undefined}
          pt={variant === 'classic' ? 'xl' : undefined}
          width="100%"
        >
          <Bordered
            asChild
            borderColor={variant === 'classic' ? 'transparent' : undefined}
            borderStyle="solid"
            borderWidth="1px"
          >
            <Box
              className={colorDot}
              flexShrink="0"
              height="0.75em"
              rounded="full"
              style={{
                marginTop: '0.125rem',
                backgroundColor: value?.match(/^#[0-9A-F]{6}$/i)
                  ? value
                  : undefined
              }}
              width="0.75em"
            />
          </Bordered>
          <Placeholder
            color={variant === 'classic' ? 'transparent' : 'default'}
            focusColor="default"
          >
            <Box asChild minWidth="7em" rounded="lg" width="100%">
              <Text asChild tracking="wider">
                <input
                  ref={autoFocusableRef(autoFocus, ref)}
                  placeholder="#FFFFFF"
                  value={value}
                  onBlur={e => {
                    onChange(e.target.value.trim().toUpperCase())
                  }}
                  onChange={e => {
                    onChange(e.target.value)
                  }}
                />
              </Text>
            </Box>
          </Placeholder>
        </Flex>
      </Flex>
      <InputActionButton
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

export default ColorInput
