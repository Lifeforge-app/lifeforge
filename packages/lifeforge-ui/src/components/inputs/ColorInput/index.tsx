import { Icon } from '@iconify/react'
import { useRef } from 'react'

import { useModalStore } from '@components/overlays'

import InputIcon from '../shared/components/InputIcon'
import InputLabel from '../shared/components/InputLabel'
import InputWrapper from '../shared/components/InputWrapper'
import useInputLabel from '../shared/hooks/useInputLabel'
import { autoFocusableRef } from '../shared/utils/autoFocusableRef'
import ColorPickerModal from './ColorPickerModal'

interface ColorInputProps {
  /** The label text displayed above the color input field. */
  label: string
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
  const open = useModalStore(state => state.open)

  const inputLabel = useInputLabel({ namespace, label })

  const ref = useRef<HTMLInputElement | null>(null)

  return (
    <InputWrapper
      className={className}
      disabled={disabled}
      errorMsg={errorMsg}
      inputRef={ref}
    >
      <InputIcon
        active={value !== ''}
        hasError={!!errorMsg}
        icon="tabler:palette"
      />
      <div className="flex w-full items-center gap-2">
        <InputLabel
          active={!!value}
          hasError={!!errorMsg}
          label={inputLabel}
          required={required}
        />
        <div className="mt-6 mr-4 flex w-full items-center gap-2 pl-4">
          <div
            className={`group-focus-within:border-bg-400 dark:group-focus-within:border-bg-700 mt-0.5 size-3 shrink-0 rounded-full border border-transparent`}
            style={{
              backgroundColor: value?.match(/^#[0-9A-F]{6}$/i)
                ? value
                : undefined
            }}
          />
          <input
            ref={autoFocusableRef(autoFocus, ref)}
            className="focus:placeholder:text-bg-500 h-8 w-full min-w-28 rounded-lg bg-transparent p-6 pl-0 tracking-wide placeholder:text-transparent focus:outline-hidden"
            placeholder="#FFFFFF"
            value={value}
            onBlur={e => {
              onChange(e.target.value.trim().toUpperCase())
            }}
            onChange={e => {
              onChange(e.target.value)
            }}
          />
        </div>
        <button
          className="text-bg-500 hover:bg-bg-200 hover:text-bg-800 dark:hover:bg-bg-700/70 dark:hover:text-bg-200 mr-4 shrink-0 rounded-lg p-2 transition-all focus:outline-hidden"
          type="button"
          onClick={() => {
            open(ColorPickerModal, {
              value,
              onChange
            })
          }}
        >
          <Icon className="size-6" icon="tabler:color-picker" />
        </button>
      </div>
    </InputWrapper>
  )
}

export default ColorInput
