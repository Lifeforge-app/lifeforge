import clsx from 'clsx'

import { Flex } from '@components/primitives'

import * as styles from './Widget.css'
import TitleAndDesc from './components/TitleAndDesc'
import WidgetIcon from './components/WidgetIcon'

export interface WidgetProps {
  /** Additional CSS class names to apply to the outer wrapper of the component. */
  className?: string
  /** The icon to display beside the title. Should be a valid icon name from Iconify. */
  icon: string
  iconColor?: string
  /** The title of the widget. This title will be used as a key for translation if a namespace is provided.
   *
   * The translation shall be looked up using the keys:
   * - `widgets.[camelCasedTitle].title`
   * - `widgets.[camelCasedTitle]`
   *
   * If no translation is found, the raw title string will be displayed.
   */
  title?: React.ReactNode
  /** The description of the widget. This description will be used as a key for translation if a namespace is provided.
   *
   * The translation shall be looked up using the keys:
   * - `widgets.[camelCasedTitle].description`
   *
   * If no translation is found, the raw description string will be displayed.
   */
  description?: React.ReactNode
  /** The content of the widget. */
  children?: React.ReactNode | string
  /** An optional component to render beside the title, such as action buttons or dropdowns. */
  actionComponent?: React.ReactNode
  /** The namespace for translation keys. Set to `false` to disable translations. */
  namespace?: string | false
  /** The variant of the widget. */
  variant?: 'default' | 'large-icon'
  /** Ref to the outer div element. */
  ref?: React.Ref<HTMLDivElement>
}

/**
 * A reusable Widget component for displaying content in a card-like layout with a title and icon.
 * Especially useful for dashboard or panel interfaces.
 */
export default function Widget({
  className = '',
  icon,
  iconColor,
  title,
  description,
  children,
  actionComponent: componentBesideTitle,
  namespace = 'common.dashboard',
  variant = 'default',
  ref
}: WidgetProps) {
  return (
    <Flex
      ref={ref as React.Ref<HTMLElement>}
      shadow
      as="div"
      bg={{ base: 'bg-50', dark: 'bg-900' }}
      className={clsx(styles.wrapper, className)}
      direction="column"
      gap="lg"
      height="100%"
      p="md"
      rounded="lg"
      width="100%"
    >
      {title && (
        <Flex align="center" gap="2xl" justify="between">
          <Flex
            align={
              variant === 'large-icon'
                ? 'start'
                : description
                  ? 'start'
                  : 'center'
            }
            as="h2"
            direction={variant === 'large-icon' ? 'column' : 'row'}
            gap={variant === 'large-icon' ? 'sm' : undefined}
            minWidth="0"
            style={variant !== 'large-icon' ? { gap: '0.75rem' } : undefined}
            width="100%"
          >
            <WidgetIcon
              description={description}
              icon={icon}
              iconColor={iconColor}
              variant={variant}
            />
            <TitleAndDesc
              description={description}
              namespace={namespace}
              title={title}
              variant={variant}
            />
          </Flex>
          {componentBesideTitle}
        </Flex>
      )}
      {children}
    </Flex>
  )
}
