import clsx from 'clsx'

import { Box, type BoxProps } from '@/components/primitives'

import * as styles from './SliderInput.css'
import { SliderHeader } from './components/SliderHeader'
import { SliderTicks } from './components/SliderTicks'

export interface SliderInputProps extends Omit<
  BoxProps<'div'>,
  'value' | 'onChange'
> {
  label?: string
  icon?: string
  value: number
  onChange: (value: number) => void
  required?: boolean
  disabled?: boolean
  min?: number
  max?: number
  step?: number
  className?: string
  namespace?: string | false
  renderValue?: (value: number) => string
}

export function SliderInput({
  label,
  icon,
  value,
  onChange,
  required,
  disabled,
  min = 0,
  max = 100,
  step = 1,
  className,
  namespace,
  renderValue,
  ...rest
}: SliderInputProps) {
  const progress = ((value - min) / (max - min)) * 100

  return (
    <Box width="100%" {...rest}>
      <SliderHeader
        disabled={disabled}
        icon={icon}
        label={label}
        max={max}
        min={min}
        namespace={namespace}
        renderValue={renderValue}
        required={required}
        value={value}
        onChange={onChange}
      />
      <Box
        bg={{ base: 'bg-200', dark: 'bg-800' }}
        className={clsx(
          styles.track,
          disabled && styles.inputDisabled,
          className
        )}
      >
        <Box className={styles.fill} style={{ width: `${progress}%` }} />
        <input
          className={styles.input}
          disabled={disabled}
          max={max}
          min={min}
          step={step}
          type="range"
          value={value}
          onChange={e => {
            onChange(parseFloat(e.target.value))
          }}
        />
      </Box>
      <SliderTicks max={max} min={min} renderValue={renderValue} />
    </Box>
  )
}
