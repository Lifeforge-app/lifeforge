import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import type { InferInput } from 'lifeforge-api'
import { FormModal, defineForm } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

function CreateBackupModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('core.backups')

  const queryClient = useQueryClient()

  const mutation = useMutation(
    forgeAPI.backups.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['backups'] })
      },
      onError: (error: Error) => {
        toast.error('Failed to create backup: ' + error.message)
      }
    })
  )

  const formProps = defineForm<
    InferInput<typeof forgeAPI.backups.create>['body']
  >()
    .ui({
      icon: 'tabler:plus',
      namespace: 'core.backups',
      submitButton: {
        children: 'Start Backup',
        icon: 'tabler:arrow-right',
        namespace: 'core.backups',
        iconAtEnd: true
      },
      title: 'Create Backup',
      onClose
    })
    .typesMap({
      backupName: 'text'
    })
    .setupFields({
      backupName: {
        label: 'Backup Name',
        icon: 'tabler:file-zip',
        placeholder: t('inputs.backupName.placeholder')
      }
    })
    .initialData({})
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default CreateBackupModal
