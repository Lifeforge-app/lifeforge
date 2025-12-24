import dayjs from 'dayjs'
import { Button, OptionsColumn } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import _ from 'lodash'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'shared'

import ModifyModal from '../modals/ModifyModal'

function OrdinaryColumn({
  title,
  id,
  icon,
  type
}: {
  title: string
  id: string
  icon: string
  type: 'text' | 'datetime'
}) {
  const open = useModalStore(state => state.open)

  const { userData } = useAuth()

  const { t } = useTranslation('common.accountSettings')

  const handleOpenModifyModal = useCallback(() => {
    open(ModifyModal, {
      type,
      title,
      id,
      icon
    })
  }, [id, icon, title, type])

  return (
    <>
      <OptionsColumn
        description={t(`settings.desc.${_.camelCase(title)}`)}
        icon={icon}
        title={t(`settings.title.${_.camelCase(title)}`)}
      >
        <div className="flex-between w-full gap-3">
          <span className="text-bg-500 whitespace-nowrap">
            {(() => {
              if (!userData) return null

              if (userData[id as keyof typeof userData] === '') {
                return t('settings.empty')
              }

              if (type === 'datetime') {
                return dayjs(userData[id as keyof typeof userData]).format(
                  'DD MMM YYYY'
                )
              }

              return userData[id as keyof typeof userData]
            })()}
          </span>
          <Button
            icon="tabler:pencil"
            variant="plain"
            onClick={handleOpenModifyModal}
          />
        </div>
      </OptionsColumn>
    </>
  )
}

export default OrdinaryColumn
