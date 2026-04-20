import { Switch as HeadlessSwitch } from '@headlessui/react'
import { usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

import { Box, Flex, Transition } from '@components/primitives'

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

  const colorMode = !value
    ? 'light'
    : tinycolor(derivedThemeColor).isLight() && derivedTheme === 'dark'
      ? 'dark'
      : 'light'

  return (
    <Transition duration={200} property="background-color">
      <Flex
        asChild
        align="center"
        bg={
          value
            ? {
                base: 'custom-500'
              }
            : disabled
              ? {
                  base: 'bg-300',
                  dark: 'bg-700'
                }
              : {
                  base: 'bg-300',
                  hover: 'bg-400',
                  dark: 'bg-600',
                  darkHover: 'bg-500'
                }
        }
        display="inline-flex"
        flexShrink="0"
        height="1.5em"
        justify="center"
        position="relative"
        rounded="full"
        style={disabled ? { cursor: 'not-allowed', opacity: 0.5 } : undefined}
        width="3em"
      >
        <HeadlessSwitch
          checked={value}
          onChange={!disabled ? onChange : undefined}
        >
          <Transition duration={100} easing="ease-in-out" property="transform">
            <Box
              as="span"
              bg={{
                base: colorMode === 'light' ? 'bg-100' : 'bg-900'
              }}
              display="inline-block"
              height="1em"
              rounded="full"
              style={{
                transform: value
                  ? 'translateX(calc(100% - var(--spacing)))'
                  : 'translateX(calc(-100% + var(--spacing)))'
              }}
              width="1em"
            />
          </Transition>
        </HeadlessSwitch>
      </Flex>
    </Transition>
  )
}

export default Switch
