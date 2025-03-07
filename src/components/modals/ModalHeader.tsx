import { Icon } from '@iconify/react'
import { useDebounce } from '@uidotdev/usehooks'
import clsx from 'clsx'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@components/buttons'
import { toCamelCase } from '@utils/strings'

function ModalHeader({
  title,
  needTranslate = true,
  icon,
  hasAI = false,
  onClose,
  actionButtonIcon,
  actionButtonIsRed = false,
  onActionButtonClick,
  className = '',
  appendTitle,
  namespace = 'common.modals'
}: {
  title: string
  needTranslate?: boolean
  icon: string
  hasAI?: boolean
  onClose: () => void
  actionButtonIcon?: string
  actionButtonIsRed?: boolean
  onActionButtonClick?: () => void
  className?: string
  appendTitle?: React.ReactElement
  namespace?: string
}): React.ReactElement {
  const { t } = useTranslation(namespace)
  const innerTitle = useDebounce(title, 100)
  const innerIcon = useDebounce(icon, 100)

  return (
    <div className={clsx('flex-between mb-4 flex gap-4', className)}>
      <h1 className="flex w-full min-w-0 items-center gap-3 text-2xl font-semibold">
        <Icon className="size-7 shrink-0" icon={innerIcon} />
        <span className="min-w-0 truncate">
          {needTranslate
            ? t([
                `modals.${toCamelCase(innerTitle)}.title`,
                `modals.${toCamelCase(innerTitle)}`,
                `${toCamelCase(innerTitle)}.title`,
                `${toCamelCase(innerTitle)}`,
                `${innerTitle}.title`,
                `${innerTitle}`,
                `modals.${innerTitle}.title`,
                `modals.${innerTitle}`
              ])
            : innerTitle}
        </span>
        {hasAI && (
          <Icon
            className="size-5 shrink-0 text-yellow-500"
            icon="mage:stars-c"
          />
        )}
        {appendTitle}
      </h1>
      <div className="flex items-center gap-2">
        {actionButtonIcon !== undefined && (
          <button
            className={clsx(
              'rounded-md p-2 transition-all hover:bg-bg-100 dark:hover:bg-bg-800',
              actionButtonIsRed
                ? 'text-red-500 hover:text-red-600'
                : 'text-bg-500 hover:text-bg-200'
            )}
            onClick={onActionButtonClick}
          >
            <Icon className="size-6" icon={actionButtonIcon} />
          </button>
        )}
        <Button
          icon="tabler:x"
          iconClassName="size-6"
          variant="no-bg"
          onClick={() => {
            onClose()
          }}
        />
      </div>
    </div>
  )
}

export default ModalHeader
