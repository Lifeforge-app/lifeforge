import { Icon, loadIcon } from '@iconify/react'
import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useModalStore } from '@components/overlays'

import InputIcon from '../shared/components/InputIcon'
import InputLabel from '../shared/components/InputLabel'
import InputWrapper from '../shared/components/InputWrapper'
import useInputLabel from '../shared/hooks/useInputLabel'
import { autoFocusableRef } from '../shared/utils/autoFocusableRef'
import IconPickerModal from './IconPickerModal'

interface IconInputProps {
  /** The label text displayed above the icon input field. */
  label: string
  /** The current icon value of the input. Should be a valid icon name from Iconify. */
  value: string
  /** Callback function called when the icon value changes. */
  onChange: (value: string) => void
  /** Whether the field is required for form validation. */
  required?: boolean
  /** Whether the input is disabled and non-interactive. */
  disabled?: boolean
  /** Whether the input should automatically focus when rendered. */
  autoFocus?: boolean
  /** The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
  namespace?: string
  /** Error message to display when the input is invalid. */
  errorMsg?: string
}

function IconInput({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  autoFocus = false,
  namespace,
  errorMsg
}: IconInputProps) {
  const open = useModalStore(state => state.open)

  const inputLabel = useInputLabel({ namespace, label })

  const [iconExists, setIconExists] = useState(false)

  const ref = useRef<HTMLInputElement>(null)

  const handleIconSelectorOpen = useCallback(() => {
    open(IconPickerModal, { setSelectedIcon: onChange })
  }, [open, onChange])

  useEffect(() => {
    let active = true

    if (!value) {
      setIconExists(false)

      return
    }
    loadIcon(value)
      .then(() => {
        if (active) setIconExists(true)
      })
      .catch(() => {
        if (active) setIconExists(false)
      })

    return () => {
      active = false
    }
  }, [value])

  return (
    <InputWrapper disabled={disabled} errorMsg={errorMsg} inputRef={ref}>
      <InputIcon active={!!value} hasError={!!errorMsg} icon="tabler:icons" />
      <div className="flex w-full items-center gap-2">
        <InputLabel
          active={!!value}
          hasError={!!errorMsg}
          label={inputLabel}
          required={required}
        />
        <div className="mt-6 flex w-full items-center gap-2 pl-4">
          <span className="icon-input-icon size-5 shrink-0">
            <Icon
              className={clsx(
                'size-5 shrink-0',
                !value &&
                  'pointer-events-none opacity-0 group-focus-within:opacity-100'
              )}
              icon={value && iconExists ? value : 'tabler:question-mark'}
            />
          </span>
          <input
            ref={autoFocusableRef(autoFocus, ref)}
            autoComplete="off"
            className="focus:placeholder:text-bg-500 h-8 w-full rounded-lg bg-transparent py-6 tracking-wide placeholder:text-transparent focus:outline-none"
            disabled={disabled}
            name={label}
            placeholder="tabler:cube"
            value={value}
            onBlur={e => {
              onChange(e.target.value.trim())
            }}
            onChange={e => onChange(e.target.value)}
          />
        </div>
        <button
          aria-label="选择图标"
          className="text-bg-500 hover:bg-bg-300 hover:text-bg-800 dark:hover:bg-bg-700/70 dark:hover:text-bg-200 mr-4 shrink-0 rounded-lg p-2 transition-all focus:outline-none"
          disabled={disabled}
          tabIndex={0}
          type="button"
          onClick={handleIconSelectorOpen}
        >
          <Icon className="size-6" icon="heroicons:chevron-up-down-16-solid" />
        </button>
      </div>
    </InputWrapper>
  )
}

export default IconInput
