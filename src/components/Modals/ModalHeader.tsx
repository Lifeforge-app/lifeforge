import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'

function ModalHeader({
  title,
  icon,
  onClose,
  hasDeleteButton = false,
  onDelete
}: {
  title: string
  icon: string
  onClose: () => void
  hasDeleteButton?: boolean
  onDelete?: () => void
}): React.ReactElement {
  const { t } = useTranslation()

  return (
    <div className="mb-8 flex items-center justify-between ">
      <h1 className="flex items-center gap-3 text-2xl font-semibold">
        <Icon icon={icon} className="size-7" />
        {t(`modals.header.${toCamelCase(title)}`)}
      </h1>
      <div className="flex items-center gap-2">
        {hasDeleteButton && (
          <button
            onClick={onDelete}
            className="rounded-md p-2 text-red-500 transition-all hover:bg-bg-200/50 hover:text-red-600 dark:hover:bg-bg-800"
          >
            <Icon icon="tabler:trash" className="size-6" />
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
