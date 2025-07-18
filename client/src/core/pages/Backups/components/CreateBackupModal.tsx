import { useQueryClient } from '@tanstack/react-query'
import { FormModal, type IFieldProps } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

function CreateBackupModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('core.backups')

  const queryClient = useQueryClient()

  const [data, setData] = useState<{
    backupName: string
  }>({
    backupName: ''
  })

  useEffect(() => {
    setData({
      backupName: ''
    })
  }, [])

  const FIELDS: IFieldProps<{
    backupName: string
  }>[] = [
    {
      id: 'backupName',
      label: 'Backup Name',
      icon: 'tabler:file-zip',
      placeholder: t('inputs.backupName.placeholder'),
      type: 'text'
    }
  ]

  return (
    <FormModal
      customUpdateDataList={{
        create: () => {
          queryClient.invalidateQueries({
            queryKey: ['backups']
          })
        }
      }}
      data={data}
      endpoint="backups"
      fields={FIELDS}
      icon="tabler:plus"
      namespace="core.backups"
      openType="create"
      queryKey={['backups']}
      setData={setData}
      submitButtonProps={{
        children: 'Start Backup',
        icon: 'tabler:arrow-right',
        namespace: 'core.backups',
        iconAtEnd: true
      }}
      title="Create Backup"
      onClose={onClose}
    />
  )
}

export default CreateBackupModal
