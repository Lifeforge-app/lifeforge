import { Icon } from '@iconify/react'
import { useDebounce } from '@uidotdev/usehooks'
import clsx from 'clsx'
import _ from 'lodash'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '../../../buttons'

function ModalHeader({
  title,
  icon,
  onClose,
  className = '',
  hasAI = false,
  appendTitle,
  namespace = 'common.modals',
  actionButtonProps
}: {
  title: string
  icon: string
  onClose: () => void
  hasAI?: boolean
  className?: string
  appendTitle?: React.ReactElement
  namespace?: string
  actionButtonProps?: React.ComponentProps<typeof Button>
}) {
  const { t } = useTranslation(namespace)

  const innerTitle = useDebounce(title, 100)

  const innerIcon = useDebounce(icon, 100)

  return (
    <div className={clsx('flex-between mb-4 flex gap-3', className)}>
      <h1 className="flex w-full min-w-0 items-center gap-3 text-2xl font-semibold">
        <Icon className="size-7 shrink-0" icon={innerIcon} />
        <span className="min-w-0 truncate">
          {t([
            `modals.${_.camelCase(innerTitle)}.title`,
            `modals.${_.camelCase(innerTitle)}`,
            `${_.camelCase(innerTitle)}.title`,
            `${_.camelCase(innerTitle)}`,
            `${innerTitle}.title`,
            `${innerTitle}`,
            `modals.${innerTitle}.title`,
            `modals.${innerTitle}`,
            innerTitle
          ])}
        </span>
        {appendTitle}
        {hasAI && (
          <Icon
            className="size-5 shrink-0 text-yellow-500"
            icon="mage:stars-c"
          />
        )}
      </h1>
      <div className="flex items-center gap-2">
        {actionButtonProps && (
          <Button
            {...actionButtonProps}
            variant={actionButtonProps.variant || 'plain'}
          />
        )}
        <Button
          icon="tabler:x"
          iconClassName="size-6"
          variant="plain"
          onClick={onClose}
        />
      </div>
    </div>
  )
}

export default memo(ModalHeader)
