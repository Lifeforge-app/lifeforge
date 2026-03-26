import { Switch as HeadlessSwitch } from '@headlessui/react'
import { usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

import { switchRootRecipe, switchThumbRecipe } from './switch.css'

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
  const { derivedThemeColor, derivedTheme } = usePersonalization()

  return (
    <HeadlessSwitch
      checked={value}
      className={switchRootRecipe({ checked: value, disabled })}
      onChange={!disabled ? onChange : undefined}
    >
      <span
        className={switchThumbRecipe({
          checked: value,
          colorMode: !value
            ? 'light'
            : tinycolor(derivedThemeColor).isLight() && derivedTheme === 'dark'
              ? 'dark'
              : 'light'
        })}
      />
    </HeadlessSwitch>
  )
}

export default Switch
