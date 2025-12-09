import { Icon } from '@iconify/react'
import clsx from 'clsx'
import _ from 'lodash'
import { forwardRef } from 'react'
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
  title?: string
  /** The content of the widget. */
  children?: React.ReactNode
  /** An optional component to render beside the title, such as action buttons or dropdowns. */
  actionComponent?: React.ReactNode
  /** The namespace for translation keys. Set to `false` to disable translations. */
  namespace?: string | false
}

/**
 * A reusable Widget component for displaying content in a card-like layout with a title and icon.
 * Especially useful for dashboard or panel interfaces.
 */
function _Widget(
  {
    className = '',
    icon,
    title,
    children,
    actionComponent: componentBesideTitle,
    namespace = 'apps.dashboard'
  }: WidgetProps,
  ref: React.Ref<HTMLDivElement>
) {
  const { t } = useTranslation(namespace === false ? [] : [namespace])

  return (
    <div
      ref={ref}
      className={clsx(
        'shadow-custom component-bg border-bg-500/20 flex size-full flex-col gap-6 rounded-lg p-6 in-[.bordered]:border-2',
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between gap-12">
          <h2 className="flex w-full min-w-0 items-center gap-3 text-xl font-semibold">
            <Icon className="size-6 shrink-0" icon={icon} />
            <span className="w-full min-w-0 truncate">
              {namespace !== false
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

const Widget = forwardRef<HTMLDivElement, WidgetProps>(_Widget)

Widget.displayName = 'Widget'

export default Widget
