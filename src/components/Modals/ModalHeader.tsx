import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'

function ModalHeader({
  title,
  needTranslate = true,
  icon,
  onClose,
  actionButtonIcon,
  actionButtonIsRed = false,
  onActionButtonClick,
  className = '',
  appendTitle
}: {
  title: string
  needTranslate?: boolean
  icon: string
  onClose: () => void
  actionButtonIcon?: string
  actionButtonIsRed?: boolean
  onActionButtonClick?: () => void
  className?: string
  appendTitle?: React.ReactElement
}): React.ReactElement {
  const { t } = useTranslation()

  return (
    <div className={`flex-between mb-8 flex ${className}`}>
      <div className="flex items-center gap-4">
        <h1 className="flex items-center gap-3 text-2xl font-semibold">
          <Icon icon={icon} className="size-7" />
          {needTranslate ? t(`modals.header.${toCamelCase(title)}`) : title}
        </h1>
        {appendTitle}
      </div>
      <div className="flex items-center gap-2">
        {actionButtonIcon !== undefined && (
          <button
            onClick={onActionButtonClick}
            className={`rounded-md p-2 transition-all hover:bg-bg-200/50 ${
              actionButtonIsRed
                ? 'text-red-500 hover:text-red-600'
                : 'text-bg-500 hover:text-bg-200'
            } dark:hover:bg-bg-800`}
          >
            <Icon icon={actionButtonIcon} className="size-6" />
          </button>
        )}
        <button
          onClick={onClose}
          className="rounded-md p-2 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-100"
        >
          <Icon icon="tabler:x" className="size-6" />
        </button>
      </div>
    </div>
  )
}

export default ModalHeader
