import { Switch as HeadlessSwitch } from '@headlessui/react'
import clsx from 'clsx'
import { usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

interface SwitchProps {
  /** Whether the switch is currently checked (on) or unchecked (off). */
  value: boolean
  /** Callback function called when the switch state changes. */
  onChange: (value: boolean) => void
}

/**
 * A switch component for toggling between two states.
 */
function Switch({ value, onChange }: SwitchProps) {
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
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full',
        value ? 'bg-custom-500' : '-component-bg-with-hover'
      )}
      onChange={onChange}
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
