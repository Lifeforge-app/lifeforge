import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { t } from 'i18next'
import type { InferInput } from 'lifeforge-api'
import { FormModal, defineForm } from 'lifeforge-ui'
import { toast } from 'react-toastify'

import type { MomentVaultEntry } from '..'

function ModifyTextEntryModal({
  data: { initialData },
  onClose
}: {
  data: {
    initialData?: MomentVaultEntry
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    forgeAPI.momentVault.entries.update
      .input({
        id: initialData?.id || ''
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['momentVault', 'entries']
          })
          onClose()
        },
        onError: () => {
          toast.error('Failed to modify text entry')
        }
      })
  )

  const formProps = defineForm<
    InferInput<typeof forgeAPI.momentVault.entries.update>['body']
  >()
    .ui({
      title: 'Update Text Entry',
      namespace: 'apps.momentVault',
      icon: 'tabler:pencil',
      onClose,
      submitButton: 'update'
    })
    .typesMap({
      content: 'textarea'
    })
    .setupFields({
      content: {
        placeholder: t('apps.momentVault:placeholders.textEntry'),
        required: true,
        icon: 'tabler:file-text',
        label: t('apps.momentVault:fields.textContent')
      }
    })
    .initialData({
      content: initialData?.content || ''
    })
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyTextEntryModal
