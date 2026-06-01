import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import z from 'zod'

import { FormModal, TextField, createDefaultValues } from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

const schema = z.object({
  backupName: z
    .string()
    .regex(
      /^[a-z0-9_-]+\.zip$/,
      'Backup name must be a .zip file, using only lowercase letters, numbers, hyphens, and underscores'
    )
    .optional()
})

function CreateBackupModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('common.backups')

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

  const form = useForm({
    defaultValues: createDefaultValues(schema),
    mode: 'all',
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        handler: mutation.mutateAsync,
        icon: 'tabler:arrow-right',
        label: 'Start Backup'
      }}
      uiConfig={{
        icon: 'tabler:plus',
        namespace: 'common.backups',
        title: 'Create Backup',
        onClose
      }}
    >
      <TextField
        control={form.control}
        icon="tabler:file-zip"
        label="Backup Name (must end with .zip)"
        name="backupName"
        placeholder={t('inputs.backupName.placeholder')}
      />
    </FormModal>
  )
}

export default CreateBackupModal
