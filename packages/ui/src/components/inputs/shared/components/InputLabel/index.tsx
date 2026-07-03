import clsx from 'clsx'
import { type CSSProperties, memo } from 'react'

import { Flex, Icon, Text, Transition } from '@/components/primitives'

import { useInputFocused } from '../../contexts/InputFocusContext'
import {
  inputLabelActiveStyle,
  inputLabelInactiveStyle
} from './InputLabel.css'

interface InputLabelProps {
  label: string
  active: boolean
  required?: boolean
  hasError?: boolean
  className?: string
  style?: CSSProperties
}

function _InputLabel({
  label,
  active,
  required = false,
  hasError = false,
  className,
  style
}: InputLabelProps) {
  const focused = useInputFocused()

  return (
    <Transition duration="100ms">
      <Flex
        align="center"
        className={clsx(
          active || focused ? inputLabelActiveStyle : inputLabelInactiveStyle,
          className
        )}
        gap="xs"
        left="0"
        minWidth="0"
        position="absolute"
        pr="lg"
        style={{
          pointerEvents: 'none',
          transform: 'translateY(-50%)',

          ...style
        }}
        width="100%"
      >
        <Text
          truncate
          align="left"
          color={hasError ? 'dangerous' : focused ? 'custom-500' : 'bg-500'}
          weight="medium"
        >
          {label}
        </Text>
        {required && (
          <Icon color="dangerous" icon="uil:asterisk" size="0.75em" />
        )}
      </Flex>
    </Transition>
  )
}

export const InputLabel = memo(_InputLabel)
