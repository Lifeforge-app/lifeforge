import forgeAPI from '@/utils/forgeAPI'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormModal, defineForm } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import type { InferInput } from 'shared'

function CreateBackupModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('apps.backups')

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

  const { formProps } = defineForm<
    InferInput<typeof forgeAPI.backups.create>['body']
  >({
    icon: 'tabler:plus',
    namespace: 'apps.backups',
    submitButton: {
      children: 'Start Backup',
      icon: 'tabler:arrow-right',
      namespace: 'apps.backups',
      iconPosition: 'end'
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
