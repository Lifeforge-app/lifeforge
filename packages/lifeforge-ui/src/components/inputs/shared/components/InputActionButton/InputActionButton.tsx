import { Icon } from '@iconify/react'
import { clsx } from 'clsx'
import { type ComponentPropsWithoutRef, type ReactNode } from 'react'

import { Flex } from '@components/primitives'

import * as styles from './InputActionButton.css'

interface InputActionButtonProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  'type'
> {
  /** Iconify icon name to display inside the button. */
  icon: string
  /** Visual style variant of the button. */
  variant?: 'classic' | 'plain'
  /** Whether to merge the button styles into a single child element instead of rendering a native button. */
  asChild?: boolean
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
  asChild = false,
  children,
  ...rest
}: InputActionButtonProps) {
  return (
    <Flex
      align="center"
      asChild={asChild}
      bg={{ base: 'transparent', hover: 'bg-200', darkHover: 'bg-800' }}
      className={clsx(styles.root, className)}
      flexShrink="0"
      justify="center"
      p="sm"
      position="absolute"
      right="0"
      rounded="lg"
      style={{
        ...style,
        marginRight: variant === 'classic' ? '1rem' : '0.75rem'
      }}
    >
      {asChild ? (
        children
      ) : (
        <button type="button" {...rest}>
          <Icon icon={icon} style={{ width: '1.25em', height: '1.25em' }} />
        </button>
      )}
    </Flex>
  )
}

export default InputActionButton
