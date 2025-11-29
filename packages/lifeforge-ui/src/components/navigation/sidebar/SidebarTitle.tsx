import { Icon } from '@iconify/react'
import clsx from 'clsx'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

type SidebarTitleProps = {
  /** Label string or React element to display for the sidebar title. */
  label: string
  /** Additional CSS classes to apply to the sidebar title. */
  className?: string
  /** Action button to display on the right side of the sidebar title. */
  actionButton?:
    | React.ReactElement
    | {
        icon: string
        onClick: () => void
      }
  /** The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
  namespace?: string
}

/** A title for a section in the sidebar navigation. */
function SidebarTitle({
  label,
  className,
  actionButton,
  namespace
}: SidebarTitleProps) {
  const { t } = useTranslation([namespace, 'common.sidebar'])

  return (
    <li
      className={clsx(
        'flex-between flex gap-3 pt-2 pr-5 pl-8 transition-all',
        actionButton !== undefined ? 'pb-2' : 'pb-4'
      )}
    >
      <h3
        className={clsx(
          'text-bg-400 dark:text-bg-600 text-sm font-semibold tracking-widest whitespace-nowrap uppercase',
          className
        )}
      >
        {t([
          `sidebar.${_.camelCase(label)}`,
          `common.sidebar:categories.${_.camelCase(label)}`,
          label
        ])}
      </h3>
      {actionButton && 'icon' in actionButton ? (
        <button
          className={clsx(
            'text-bg-400 dark:text-bg-600 flex items-center rounded-md p-2 transition-all',
            'hover:bg-bg-100 dark:hover:bg-bg-800 dark:hover:text-bg-50'
          )}
          onClick={actionButton.onClick}
        >
          <Icon className="size-5" icon={actionButton.icon} />
        </button>
      ) : (
        actionButton
      )}
    </li>
  )
}

export default SidebarTitle
