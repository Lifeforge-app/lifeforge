import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { FormModal, createDefaultValues, toast } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { MomentVaultEntry } from '..'

const schema = z.object({
  content: z.string().min(1, 'Required')
})

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
    forgeAPI.entries.update
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

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      content: initialData?.content || ''
    },
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: 'update',
        handler: async values => {
          await mutation.mutateAsync(values)
        }
      }}
      uiConfig={{
        icon: 'tabler:pencil',
        loading: false,
        namespace: 'apps.momentVault',
        title: 'Update Entry',
        onClose
      }}
    >
      <></>
    </FormModal>
  )
}

export default ModifyTextEntryModal
