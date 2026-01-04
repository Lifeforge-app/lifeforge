import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormModal, defineForm } from 'lifeforge-ui'
import { toast } from 'react-toastify'
import type { InferInput, InferOutput } from 'shared'

import forgeAPI from '../utils/forgeAPI'

type Client = InferOutput<
  typeof forgeAPI.melvinchia3636$invoice_maker.clients.list
>[number]

interface ClientModalProps {
  data: {
    type: 'create' | 'update'
    initialData?: Partial<Client>
  }
  onClose: () => void
}

export default function ModifyClientModal({
  data: { type, initialData },
  onClose
}: ClientModalProps) {
  const qc = useQueryClient()

  const createMutation = useMutation(
    forgeAPI.melvinchia3636$invoice_maker.clients.create.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['invoiceMaker', 'clients'] })
        toast.success('Client created successfully')
        onClose()
      },
      onError: error => {
        toast.error(`Failed to create client: ${error.message}`)
      }
    })
  )

  const updateMutation = useMutation(
    forgeAPI.melvinchia3636$invoice_maker.clients.update
      .input({
        id: initialData?.id || ''
      })
      .mutationOptions({
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ['invoiceMaker', 'clients'] })
          toast.success('Client updated successfully')
          onClose()
        },
        onError: error => {
          toast.error(`Failed to update client: ${error.message}`)
        }
      })
  )

  const { formProps } = defineForm<
    InferInput<
      typeof forgeAPI.melvinchia3636$invoice_maker.clients.create
    >['body']
  >({
    title:
      type === 'update' ? 'modals.clients.update' : 'modals.clients.create',
    icon: type === 'update' ? 'tabler:pencil' : 'tabler:plus',
    namespace: 'apps.melvinchia3636__invoiceMaker',
    submitButton: type === 'update' ? 'update' : 'create',
    onClose
  })
    .typesMap({
      name: 'text',
      address: 'textarea',
      email: 'text',
      phone: 'text'
    })
    .setupFields({
      name: {
        icon: 'tabler:building',
        label: 'inputs.name',
        placeholder: 'Company or individual name',
        required: true
      },
      address: {
        icon: 'tabler:map-pin',
        label: 'inputs.address',
        placeholder: 'Full billing address'
      },
      email: {
        icon: 'tabler:mail',
        label: 'inputs.email',
        placeholder: 'client@example.com'
      },
      phone: {
        icon: 'tabler:phone',
        label: 'inputs.phone',
        placeholder: '+60 12-345 6789'
      }
    })
    .initialData(initialData)
    .onSubmit(async data => {
      if (type === 'update') {
        await updateMutation.mutateAsync(data)
      } else {
        await createMutation.mutateAsync(data)
      }
    })
    .build()

  return <FormModal {...formProps} />
}
