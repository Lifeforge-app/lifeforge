import clsx from 'clsx'

import { Box } from '@components/primitives'

import { SliderHeader } from './components/SliderHeader'
import { SliderTicks } from './components/SliderTicks'

interface SliderInputProps {
  /** The label text displayed above the slider field. */
  label?: string
  /** The icon to display next to the slider. Should be a valid icon name from Iconify. */
  icon?: string
  /** The current numeric value of the slider. */
  value: number
  /** Callback function called when the slider value changes. */
  onChange: (value: number) => void
  /** Whether the slider field is required for form validation. */
  required?: boolean
  /** Whether the slider is disabled and non-interactive. */
  disabled?: boolean
  /** The minimum value allowed for the slider. */
  min?: number
  /** The maximum value allowed for the slider. */
  max?: number
  /** The step increment for slider value changes. */
  step?: number
  /** Additional CSS class names to apply to the slider container. Use `!` suffix for Tailwind CSS class overrides. */
  className?: string
  /** Additional CSS class names to apply to the outer wrapper of the component. Use `!` suffix for Tailwind CSS class overrides. */
  wrapperClassName?: string
  /** The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
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
      <Box width="100%">
        <Box
          asChild
          shadow
          bg={{ base: 'bg-200', dark: 'bg-800' }}
          width="100%"
        >
          <input
            className={clsx('range range-primary', className)}
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
        <SliderTicks max={max} min={min} />
      </Box>
    </Box>
  )
}

