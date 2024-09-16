import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@components/ButtonsAndInputs/Button'
import ConfigColumn from '@components/Miscellaneous/ConfigColumn'
import { useAuthContext } from '@providers/AuthProvider'
import ModifyModal from './ModifyModal'

function OrdinaryColumn({
  title,
  id,
  icon
}: {
  title: string
  id: string
  icon: string
}): React.ReactElement {
  const { userData } = useAuthContext()
  const { t } = useTranslation()
  const [modifyModalOpen, setModifyModalOpen] = useState(false)

  return (
    <>
      <ConfigColumn
        title={t(`accountSettings.title.${title}`)}
        desc={t(`accountSettings.desc.${title}`)}
        icon={icon}
      >
        <span className="whitespace-nowrap text-bg-500">{userData[id]}</span>
        <Button
          onClick={() => {
            setModifyModalOpen(true)
          }}
          variant="no-bg"
          icon="tabler:pencil"
        />
      </ConfigColumn>
      <ModifyModal
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
