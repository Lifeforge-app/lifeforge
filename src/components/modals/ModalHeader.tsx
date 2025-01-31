import { Icon } from '@iconify/react'
import { useDebounce } from '@uidotdev/usehooks'
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
    <div className={`flex-between mb-4 flex gap-4 ${className}`}>
      <h1 className="flex w-full min-w-0 items-center gap-3 text-2xl font-semibold">
        <Icon icon={innerIcon} className="size-7 shrink-0" />
        <span className="min-w-0 truncate">
          {needTranslate
            ? t([
                `${toCamelCase(innerTitle)}`,
                `${toCamelCase(innerTitle)}.title`,
                `modals.${toCamelCase(innerTitle)}`,
                `modals.${toCamelCase(innerTitle)}.title`,
                `${innerTitle}`,
                `${innerTitle}.title`,
                `modals.${innerTitle}`,
                `modals.${innerTitle}.title`
              ])
            : innerTitle}
        </span>
        {hasAI && (
          <Icon
            icon="mage:stars-c"
            className="size-5 shrink-0 text-yellow-500"
          />
        )}
        {appendTitle}
      </h1>
      <div className="flex items-center gap-2">
        {actionButtonIcon !== undefined && (
          <button
            onClick={onActionButtonClick}
            className={`rounded-md p-2 transition-all hover:bg-bg-100 ${
              actionButtonIsRed
                ? 'text-red-500 hover:text-red-600'
                : 'text-bg-500 hover:text-bg-200'
            } dark:hover:bg-bg-800`}
          >
            <Icon icon={actionButtonIcon} className="size-6" />
          </button>
        )}
        <Button
          variant="no-bg"
          onClick={() => {
            onClose()
          }}
          iconClassName="size-6"
          icon="tabler:x"
        />
      </div>
    </div>
  )
}

export default ModalHeader
