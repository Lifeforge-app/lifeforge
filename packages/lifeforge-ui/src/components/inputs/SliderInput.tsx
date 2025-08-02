import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'

import useInputLabel from './shared/hooks/useInputLabel'

interface SliderInputProps {
  label: string
  icon: string
  value: number
  setValue: (value: number) => void
  required?: boolean
  disabled?: boolean
  min?: number
  max?: number
  step?: number
  className?: string
  namespace: string | false
  tKey?: string
}

function SliderInput({
  label,
  icon,
  value,
  setValue,
  required,
  disabled,
  min = 0,
  max = 100,
  step = 1,
  className,
  namespace,
  tKey
}: SliderInputProps) {
  const inputLabel = useInputLabel(namespace, label, tKey)

  return (
    <div>
      <div className="text-bg-400 dark:text-bg-600 flex items-center gap-2 font-medium tracking-wide">
        <Icon className="size-6 shrink-0" icon={icon} />
        <span>
          {inputLabel}
          {required && <span className="text-red-500"> *</span>}
        </span>
      </div>
      <div className="mt-4 w-full pb-3">
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
            setValue(parseInt(e.target.value, 10))
          }}
        />
        <div className="mb-4 flex w-full justify-between px-2.5 text-xs">
          {[min, Math.round(min + max / 2), max].map((label, index) => (
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
