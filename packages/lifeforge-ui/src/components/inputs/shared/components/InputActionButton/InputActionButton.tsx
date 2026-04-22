import { Icon } from '@iconify/react'
import { type ComponentPropsWithoutRef, type ReactNode } from 'react'

import { Flex, Text, Transition } from '@components/primitives'

import type { InputVariant } from '../../types'

interface InputActionButtonProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  'type'
> {
  /** Iconify icon name to display inside the button. */
  icon: string
  /** Visual style variant of the button. */
  variant?: InputVariant
  hasError?: boolean
  children?: ReactNode
}

/**
 * A small icon-only action button intended for use inside input fields.
 * Renders with the standard `text-bg-500` muted tone and a subtle hover
 * background, matching the visual language of all other input chrome.
 */
function InputActionButton({
  icon,
  variant = 'classic',
  className,
  style,
  children,
  hasError = false,
  ...rest
}: InputActionButtonProps) {
  return (
    <Transition>
      <Flex
        asChild
        align="center"
        bg={{ base: 'transparent', hover: 'bg-300', darkHover: 'bg-700' }}
        className={className}
        flexShrink="0"
        justify="center"
        p="sm"
        position="absolute"
        right={hasError ? (variant === 'classic' ? '3em' : '2.5em') : '0'}
        rounded="lg"
        style={{
          // the `mr` props cannot be used since the 0.75rem value is required to be exact for the plain variant
          marginRight: variant === 'classic' ? '1em' : '0.75em',
          ...style
        }}
      >
        <Text asChild color="muted">
          {children || (
            <button
              type="button"
              onMouseDown={e => e.preventDefault()}
              {...rest}
            >
              <Icon icon={icon} style={{ width: '1.25em', height: '1.25em' }} />
            </button>
          )}
        </Text>
      </Flex>
    </Transition>
  )
}

export default InputActionButton
