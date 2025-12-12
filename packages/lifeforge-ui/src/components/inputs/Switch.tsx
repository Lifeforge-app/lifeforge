import { Switch as HeadlessSwitch } from '@headlessui/react'
import clsx from 'clsx'
import { usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

interface SwitchProps {
  /** Whether the switch is currently checked (on) or unchecked (off). */
  value: boolean
  /** Callback function called when the switch state changes. */
  onChange: (value: boolean) => void
  /** Whether the switch is disabled and non-interactive. */
  disabled?: boolean
}

/**
 * A switch component for toggling between two states.
 */
function Switch({ value, onChange, disabled }: SwitchProps) {
  const { derivedThemeColor } = usePersonalization()

  const getStateClassName = () => {
    if (value) {
      return clsx(
        tinycolor(derivedThemeColor).isLight()
          ? 'bg-bg-100 dark:bg-bg-800'
          : 'bg-bg-100',
        'translate-x-6'
      )
    }

    return 'translate-x-1 bg-bg-50 dark:bg-bg-500'
  }

  return (
    <HeadlessSwitch
      checked={value}
      className={clsx(
        'ring-bg-500/20 relative inline-flex h-6 w-11 shrink-0 items-center rounded-full in-[.bordered]:ring-2',
        value ? 'bg-custom-500' : '-component-bg-with-hover',
        disabled && 'cursor-not-allowed! opacity-50'
      )}
      onChange={!disabled ? onChange : undefined}
    >
      <span
        className={clsx(
          'inline-block size-4 shrink-0 rounded-full transition',
          getStateClassName()
        )}
      />
    </HeadlessSwitch>
  )
}

export default Switch
