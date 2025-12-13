import { Switch as HeadlessSwitch } from '@headlessui/react'
import clsx from 'clsx'

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
  return (
    <HeadlessSwitch
      checked={value}
      className={clsx(
        'focus-visible:ring-custom-500 focus-visible:ring-offset-bg-50 dark:focus-visible:ring-offset-bg-900 relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        value ? 'bg-custom-500 shadow-inner' : 'bg-bg-300 dark:bg-bg-600',
        disabled && 'cursor-not-allowed! opacity-50'
      )}
      onChange={!disabled ? onChange : undefined}
    >
      <span
        className={clsx(
          'pointer-events-none inline-block size-4 shrink-0 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out',
          value ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </HeadlessSwitch>
  )
}

export default Switch
