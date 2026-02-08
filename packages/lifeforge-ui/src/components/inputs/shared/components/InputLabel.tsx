import clsx from 'clsx'
import { memo } from 'react'

import {
  inputLabelActiveStyle,
  inputLabelBaseStyle,
  inputLabelErrorStyle,
  inputLabelFocusedStyle,
  inputLabelInactiveStyle,
  inputLabelNormalStyle,
  inputLabelRequiredStyle
} from '../input.css'

interface InputLabelProps {
  label: string
  active: boolean
  focused?: boolean
  isCombobox?: boolean
  isListboxOrCombobox?: boolean
  required?: boolean
  hasError?: boolean
}

function InputLabel({
  label,
  active,
  focused = false,
  required = false,
  hasError = false
}: InputLabelProps) {
  return (
    <span
      className={clsx(
        inputLabelBaseStyle,
        active ? inputLabelActiveStyle : inputLabelInactiveStyle,
        hasError
          ? inputLabelErrorStyle
          : focused
            ? inputLabelFocusedStyle
            : inputLabelNormalStyle
      )}
    >
      {label}
      {required && <span className={inputLabelRequiredStyle}> *</span>}
    </span>
  )
}

export default memo(InputLabel)
