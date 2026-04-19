import { Icon } from '@iconify/react'
import { clsx } from 'clsx'
import { type ComponentPropsWithoutRef } from 'react'

import { Flex } from '@components/primitives'

import * as styles from './InputActionButton.css'

interface InputActionButtonProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  'type'
> {
  /** Iconify icon name to display inside the button. */
  icon: string
}

/**
 * A small icon-only action button intended for use inside input fields.
 * Renders with the standard `text-bg-500` muted tone and a subtle hover
 * background, matching the visual language of all other input chrome.
 */
function InputActionButton({
  icon,
  className,
  ...rest
}: InputActionButtonProps) {
  return (
    <Flex
      asChild
      align="center"
      bg={{ base: 'transparent', hover: 'bg-200', darkHover: 'bg-800' }}
      className={clsx(styles.root, className)}
      flexShrink="0"
      justify="center"
      p="sm"
      rounded="lg"
    >
      <button type="button" {...rest}>
        <Icon icon={icon} style={{ width: '1.5rem', height: '1.5rem' }} />
      </button>
    </Flex>
  )
}

export default InputActionButton
