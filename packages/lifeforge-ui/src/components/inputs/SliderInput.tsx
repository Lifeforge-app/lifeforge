import { Icon } from '@iconify/react'
import clsx from 'clsx'

import useInputLabel from './shared/hooks/useInputLabel'

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

function SliderInput({
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
  const inputLabel = useInputLabel({ namespace, label: label ?? '' })

  return (
    <div className={clsx('w-full', wrapperClassName)}>
      {icon && label && (
        <div className="text-bg-400 dark:text-bg-600 mb-4 flex items-center gap-2 font-medium tracking-wide">
          <Icon className="size-6 shrink-0" icon={icon} />
          <span>
            {inputLabel}
            {required && <span className="text-red-500"> *</span>}
          </span>
        </div>
      )}
      <div className="w-full">
        <input
          className={clsx(
            'range range-primary bg-bg-200 dark:bg-bg-800 w-full',
            className
          )}
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
        <div className="mb-4 flex w-full justify-between px-2.5 text-xs">
          {[min, ((min + max) / 2).toFixed(1), max].map((label, index) => (
            <div
              key={`title-${label}-${index}`}
              className="bg-bg-300 dark:bg-bg-700 relative h-2 w-0.5 rounded-full"
            >
              <div className="text-bg-400 dark:text-bg-600 absolute -bottom-5 left-1/2 -translate-x-1/2 font-medium">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SliderInput
