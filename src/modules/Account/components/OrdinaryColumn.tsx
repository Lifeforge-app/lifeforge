import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@components/ButtonsAndInputs/Button'
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
      <div className="relative z-20 flex w-full flex-col items-center justify-between gap-6 px-4 md:flex-row">
        <div className="w-full md:w-auto">
          <h3 className="block text-xl font-medium leading-normal">
            {t(`accountSettings.title.${title}`)}
          </h3>
          <p className="text-bg-500">{t(`accountSettings.desc.${title}`)}</p>
        </div>
        <div className="flex w-full items-center justify-between gap-4 md:w-auto">
          <span className="text-bg-500">{userData[id]}</span>
          <Button
            onClick={() => {
              setModifyModalOpen(true)
            }}
            variant="no-bg"
            icon="tabler:pencil"
          />
        </div>
      </div>
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
