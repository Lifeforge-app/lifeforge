import { Icon } from '@iconify/react'
import { useDebounce } from '@uidotdev/usehooks'
import clsx from 'clsx'
import _ from 'lodash'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '../../../../inputs/Button'

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
  title: string | React.ReactNode
  icon: string
  onClose: () => void
  hasAI?: boolean
  className?: string
  appendTitle?: React.ReactElement
  namespace?: string
  actionButtonProps?: React.ComponentProps<typeof Button>
}) {
  const { t } = useTranslation(namespace)

  // Add some delay to prevent the title and icon to become empty
  // when the modal is transitioned
  const innerTitle = useDebounce(title, 100)

  const innerIcon = useDebounce(icon, 100)

  return (
    <div className={clsx('flex-between mb-4 flex gap-3', className)}>
      <h1 className="flex w-full min-w-0 items-center gap-3 text-xl font-semibold">
        <Icon className="size-6 shrink-0" icon={innerIcon} />
        {typeof innerTitle === 'string' ? (
          <>
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
          </>
        ) : (
          innerTitle
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
          className="p-3!"
          icon="tabler:x"
          variant="plain"
          onClick={onClose}
        />
      </div>
    </div>
  )
}

export default memo(ModalHeader)
