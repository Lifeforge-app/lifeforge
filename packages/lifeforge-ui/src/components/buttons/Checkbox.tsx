import { Icon } from '@iconify/react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import clsx from 'clsx'

/**
 * A checkbox component with optional label support.
 */
function Checkbox({
  checked = false,
  onCheckedChange,
  disabled,
  className,
  label
}: {
  /** Whether the checkbox is currently checked. */
  checked?: boolean
  /** Callback function called when the checked state changes. */
  onCheckedChange?: (checked: boolean) => void
  /** Whether the checkbox is disabled and non-interactive. */
  disabled?: boolean
  /** Additional CSS class names to apply to the checkbox root element. */
  className?: string
  /** Optional text label to display next to the checkbox. */
  label?: string
}) {
  return (
    <div className="flex items-center gap-3">
      <CheckboxPrimitive.Root
        checked={checked}
        className={clsx(
          'flex-center group data-[state=checked]:border-custom-500 data-[state=checked]:bg-custom-500 data-[state=unchecked]:border-bg-300 data-[state=unchecked]:dark:border-bg-600 data-[state=unchecked]:hover:border-bg-500 data-[state=unchecked]:dark:hover:border-bg-200 relative z-50 size-6 shrink-0 cursor-pointer rounded-md border-2 transition-all disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
      >
        <CheckboxPrimitive.Indicator asChild>
          <Icon
            className={clsx(
              'stroke-0.5 text-bg-100 stroke-bg-100 dark:text-bg-800 dark:stroke-bg-800 size-5 transition-all'
            )}
            icon="uil:check"
          />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <label>{label}</label>
    </div>
  )
}

export default Checkbox
