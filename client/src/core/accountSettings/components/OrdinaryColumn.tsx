import dayjs from 'dayjs'
import _ from 'lodash'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@lifeforge/shared'
import { Button, Flex, OptionsColumn, Text, useModalStore } from '@lifeforge/ui'

import ModifyModal from '../modals/ModifyModal'

function OrdinaryColumn({
  title,
  id,
  icon,
  type
}: {
  title: string
  id: 'username' | 'name' | 'email' | 'dateOfBirth'
  icon: string
  type: 'text' | 'datetime'
}) {
  const { open } = useModalStore()

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
        <Flex align="center" gap="md" justify="between" width="100%">
          <Text color="bg-500" whiteSpace="nowrap">
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
          </Text>
          <Button
            icon="tabler:pencil"
            variant="plain"
            onClick={handleOpenModifyModal}
          />
        </Flex>
      </OptionsColumn>
    </>
  )
}

export default OrdinaryColumn
