import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import clsx from 'clsx'

import { usePersonalization } from '@lifeforge/shared'

import { Bordered, Flex, Icon, Text, Transition } from '@/components/primitives'

import { checkboxRootRecipe } from './Checkbox.css'

/**
 * A checkbox component with optional label support.
 */
export function Checkbox({
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
  label?: React.ReactNode
}) {
  const { getMostReadableColor } = usePersonalization()

  return (
    <Flex align="center" gap="sm" style={{ opacity: disabled ? 0.5 : 1 }}>
      <CheckboxPrimitive.Root
        asChild
        checked={checked}
        className={clsx(checkboxRootRecipe(), className)}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
      >
        <Transition>
          <Bordered asChild borderWidth="2px">
            <Flex
              align="center"
              as="button"
              flexShrink="0"
              height="1.5em"
              justify="center"
              r="md"
              width="1.5em"
            >
              <CheckboxPrimitive.Indicator asChild>
                <Transition>
                  <Text
                    asChild
                    style={{
                      color: getMostReadableColor()
                    }}
                  >
                    <Icon
                      icon="uil:check"
                      style={{
                        width: '100%',
                        height: '100%'
                      }}
                    />
                  </Text>
                </Transition>
              </CheckboxPrimitive.Indicator>
            </Flex>
          </Bordered>
        </Transition>
      </CheckboxPrimitive.Root>
      {label && <label>{label}</label>}
    </Flex>
  )
}
