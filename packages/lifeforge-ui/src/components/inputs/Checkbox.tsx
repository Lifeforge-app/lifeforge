import { Icon } from '@iconify/react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import clsx from 'clsx'
import { usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

import {
  checkboxIndicatorDarkStyle,
  checkboxIndicatorLightStyle,
  checkboxIndicatorStyle,
  checkboxRootRecipe,
  checkboxWrapperStyle
} from './checkbox.css'

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
  const { derivedThemeColor } = usePersonalization()

  return (
    <div className={checkboxWrapperStyle}>
      <CheckboxPrimitive.Root
        checked={checked}
        className={clsx(checkboxRootRecipe(), className)}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
      >
        <CheckboxPrimitive.Indicator asChild>
          <Icon
            className={clsx(
              checkboxIndicatorStyle,
              tinycolor(derivedThemeColor).isDark()
                ? checkboxIndicatorDarkStyle
                : checkboxIndicatorLightStyle
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
