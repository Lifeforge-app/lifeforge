import moment from 'moment'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@components/buttons/Button'
import ConfigColumn from '@components/utilities/ConfigColumn'
import { useAuthContext } from '@providers/AuthProvider'
import { toCamelCase } from '@utils/strings'
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
}): React.ReactElement {
  const { userData } = useAuthContext()
  const { t } = useTranslation('modules.accountSettings')
  const [modifyModalOpen, setModifyModalOpen] = useState(false)

  return (
    <>
      <ConfigColumn
        title={t(`settings.title.${toCamelCase(title)}`)}
        desc={t(`settings.desc.${toCamelCase(title)}`)}
        icon={icon}
      >
        <div className="flex-between w-full">
          <span className="whitespace-nowrap text-bg-500">
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
            onClick={() => {
              setModifyModalOpen(true)
            }}
            variant="no-bg"
            icon="tabler:pencil"
          />
        </div>
      </ConfigColumn>
      <ModifyModal
        type={type}
        title={title}
        id={id}
        icon={icon}
        isOpen={modifyModalOpen}
        onClose={() => {
          setModifyModalOpen(false)
        }}
      />
    </>
  )
}

export default OrdinaryColumn
