import clsx from 'clsx'

import { Box } from '@/components/primitives'

import * as styles from './SliderInput.css'
import { SliderHeader } from './components/SliderHeader'
import { SliderTicks } from './components/SliderTicks'

interface SliderInputProps {
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
  wrapperClassName?: string
  namespace?: string
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
  wrapperClassName,
  namespace
}: SliderInputProps) {
  const progress = ((value - min) / (max - min)) * 100

  return (
    <Box className={wrapperClassName} width="100%">
      <SliderHeader
        icon={icon}
        label={label}
        max={max}
        namespace={namespace}
        required={required}
        value={value}
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
          disabled={disabled}
          max={max}
          min={min}
          step={step}
          type="range"
          value={value}
          className={styles.input}
          onChange={e => {
            onChange(parseFloat(e.target.value))
          }}
        />
      </Box>
      <SliderTicks max={max} min={min} />
    </Box>
  )
}
