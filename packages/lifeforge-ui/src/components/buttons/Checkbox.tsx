import { Icon } from '@iconify/react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import clsx from 'clsx'
import { usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

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
  /** Whether the checkbox is currently checked */
  checked?: boolean
  /** Callback function called when the checked state changes */
  onCheckedChange?: (checked: boolean) => void
  /** Whether the checkbox is disabled and non-interactive */
  disabled?: boolean
  /** Additional CSS classes to apply to the checkbox root element */
  className?: string
  /** Optional text label to display next to the checkbox */
  label?: string
}) {
  const { derivedThemeColor } = usePersonalization()

  return (
    <div className="flex items-center gap-3">
      <CheckboxPrimitive.Root
        checked={checked}
        className={clsx(
          'flex-center group data-[state=checked]:border-custom-500 data-[state=checked]:bg-custom-500 data-[state=unchecked]:border-bg-300 data-[state=unchecked]:dark:border-bg-600 data-[state=unchecked]:hover:border-bg-500 relative z-50 size-6 shrink-0 cursor-pointer rounded-md border-2 transition-all disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
      >
        <CheckboxPrimitive.Indicator asChild>
          <Icon
            className={clsx(
              'stroke-0.5 size-5 transition-all',
              tinycolor(derivedThemeColor).isDark()
                ? 'text-bg-100 stroke-bg-100'
                : 'text-bg-800 stroke-bg-800'
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
