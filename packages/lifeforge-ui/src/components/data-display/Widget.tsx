import { Icon } from '@iconify/react'
import clsx from 'clsx'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

export interface WidgetProps {
  /** Additional CSS class names to apply to the outer wrapper of the component. */
  className?: string
  /** The icon to display beside the title. Should be a valid icon name from Iconify. */
  icon: string
  /** The title of the widget. This title will be used as a key for translation if a namespace is provided.
   *
   * The translation shall be looked up using the keys:
   * - `widgets.[camelCasedTitle].title`
   * - `widgets.[camelCasedTitle]`
   *
   * If no translation is found, the raw title string will be displayed.
   */
  title?: React.ReactNode
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
  title,
  children,
  actionComponent: componentBesideTitle,
  namespace = 'common.dashboard',
  variant = 'default',
  ref
}: WidgetProps) {
  const { t } = useTranslation(namespace === false ? [] : [namespace])

  return (
    <div
      ref={ref}
      className={clsx(
        'shadow-custom component-bg border-bg-500/20 flex size-full flex-col gap-6 rounded-lg p-4 in-[.bordered]:border-2',
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between gap-12">
          <h2
            className={clsx(
              'flex w-full min-w-0 font-medium',
              variant === 'large-icon'
                ? 'flex-col items-start gap-2'
                : 'items-center gap-3'
            )}
          >
            {variant === 'large-icon' ? (
              <div className="shadow-custom component-bg-lighter bg-bg-100 flex rounded-lg p-2 sm:p-4">
                <Icon
                  className="text-bg-500 dark:text-bg-50 text-2xl sm:text-3xl"
                  icon={icon}
                />
              </div>
            ) : (
              <div className="bg-bg-500/10 flex-center size-9 shrink-0 rounded-md">
                <Icon
                  className="text-bg-500 dark:text-bg-50 size-5 shrink-0"
                  icon={icon}
                />
              </div>
            )}
            <span
              className={clsx(
                'w-full min-w-0 truncate',
                variant === 'large-icon'
                  ? 'text-bg-500 text-lg sm:text-xl'
                  : 'text-bg-500 dark:text-bg-50 text-lg'
              )}
            >
              {namespace !== false && typeof title === 'string'
                ? t([
                    `widgets.${_.camelCase(title)}.title`,
                    `widgets.${_.camelCase(title)}`,
                    title
                  ])
                : title}
            </span>
          </h2>
          {componentBesideTitle}
        </div>
      )}
      {children}
    </div>
  )
}
