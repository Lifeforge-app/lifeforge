import { useAuth } from '@providers/AuthProvider'
import _ from 'lodash'
import moment from 'moment'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, ConfigColumn } from '@lifeforge/ui'

import ModifyModal from './ModifyModal'

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
  const { userData } = useAuth()
  const { t } = useTranslation('modules.accountSettings')
  const [modifyModalOpen, setModifyModalOpen] = useState(false)

  return (
    <>
      <ConfigColumn
        desc={t(`settings.desc.${_.camelCase(title)}`)}
        icon={icon}
        title={t(`settings.title.${_.camelCase(title)}`)}
      >
        <div className="flex-between w-full gap-4">
          <span className="text-bg-500 whitespace-nowrap">
            {(() => {
              if (userData[id] === '') {
                return t('settings.empty')
              }

              if (type === 'date') {
                return moment(userData[id]).format('DD MMM YYYY')
              }

              return userData[id]
            })()}
          </span>
          <Button
            icon="tabler:pencil"
            variant="plain"
            onClick={() => {
              setModifyModalOpen(true)
            }}
          />
        </div>
      </ConfigColumn>
      <ModifyModal
        icon={icon}
        id={id}
        isOpen={modifyModalOpen}
        title={title}
        type={type}
        onClose={() => {
          setModifyModalOpen(false)
        }}
      />
    </>
  )
}

export default OrdinaryColumn
