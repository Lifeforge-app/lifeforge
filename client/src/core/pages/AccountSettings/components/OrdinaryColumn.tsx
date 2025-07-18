import dayjs from 'dayjs'
import { Button, ConfigColumn } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import _ from 'lodash'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '../../../providers/AuthProvider'
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
  type?: string
}) {
  const open = useModalStore(state => state.open)

  const { userData } = useAuth()

  const { t } = useTranslation('core.accountSettings')

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
      <ConfigColumn
        desc={t(`settings.desc.${_.camelCase(title)}`)}
        icon={icon}
        title={t(`settings.title.${_.camelCase(title)}`)}
      >
        <div className="flex-between w-full gap-3">
          <span className="text-bg-500 whitespace-nowrap">
            {(() => {
              if (userData[id] === '') {
                return t('settings.empty')
              }

              if (type === 'date') {
                return dayjs(userData[id]).format('DD MMM YYYY')
              }

              return userData[id]
            })()}
          </span>
          <Button
            icon="tabler:pencil"
            variant="plain"
            onClick={handleOpenModifyModal}
          />
        </div>
      </ConfigColumn>
    </>
  )
}

export default OrdinaryColumn
