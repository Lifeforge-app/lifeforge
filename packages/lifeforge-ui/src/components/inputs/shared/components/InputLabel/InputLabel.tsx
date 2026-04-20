import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { type CSSProperties, memo } from 'react'

import { Flex, Text } from '@components/primitives'

import {
  inputLabelActiveStyle,
  inputLabelBaseStyle,
  inputLabelErrorStyle,
  inputLabelFocusedStyle,
  inputLabelInactiveStyle,
  inputLabelNormalStyle,
  inputLabelRequiredStyle
} from './InputLabel.css'

interface InputLabelProps {
  label: string
  active: boolean
  focused?: boolean
  isCombobox?: boolean
  isListboxOrCombobox?: boolean
  required?: boolean
  hasError?: boolean
  className?: string
  style?: CSSProperties
}

function InputLabel({
  label,
  active,
  focused = false,
  required = false,
  hasError = false,
  className,
  style
}: InputLabelProps) {
  return (
    <Flex
      align="center"
      className={clsx(
        inputLabelBaseStyle,
        active ? inputLabelActiveStyle : inputLabelInactiveStyle,
        hasError
          ? inputLabelErrorStyle
          : focused
            ? inputLabelFocusedStyle
            : inputLabelNormalStyle,
        className
      )}
      gap="xs"
      style={style}
    >
      <Text>{label}</Text>
      {required && (
        <Text
          className={inputLabelRequiredStyle}
          color="dangerous"
          display="block"
        >
          <Icon
            icon="tabler:asterisk"
            style={{
              width: '0.625em',
              height: '0.625em'
            }}
          />
        </Text>
      )}
    </Flex>
  )
}

export default memo(InputLabel)
