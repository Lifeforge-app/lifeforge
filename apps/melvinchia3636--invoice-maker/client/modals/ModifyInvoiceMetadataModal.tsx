import type { InvoiceEntry } from '@'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { t } from 'i18next'
import { FormModal, defineForm } from 'lifeforge-ui'
import { toast } from 'react-toastify'

import { STATUS_CONFIG } from '@/components/InvoiceCard'
import forgeAPI from '@/utils/forgeAPI'

interface InvoiceMetadataModalProps {
  data: {
    invoice: InvoiceEntry
  }
  onClose: () => void
}

export default function ModifyInvoiceMetadataModal({
  data,
  onClose
}: InvoiceMetadataModalProps) {
  const { invoice } = data

  const qc = useQueryClient()

  const updateMutation = useMutation(
    forgeAPI.melvinchia3636$invoice_maker.invoices.update
      .input({
        id: invoice.id
      })
      .mutationOptions({
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ['invoiceMaker', 'invoices'] })
          onClose()
        },
        onError: () => {
          toast.error('Failed to update invoice metadata')
        }
      })
  )

  const { formProps } = defineForm<{
    invoice_number: string
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  }>({
    title: 'Edit Invoice Metadata',
    icon: 'tabler:file-invoice',
    namespace: 'apps.melvinchia3636__invoiceMaker',
    onClose,
    submitButton: {
      icon: 'tabler:device-floppy',
      children: 'Save'
    }
  })
    .typesMap({
      invoice_number: 'text',
      status: 'listbox'
    })
    .setupFields({
      invoice_number: {
        icon: 'tabler:hash',
        label: 'Invoice Number',
        placeholder: '001',
        required: true
      },
      status: {
        icon: 'tabler:info-circle',
        label: 'Status',
        required: true,
        multiple: false,
        options: Object.entries(STATUS_CONFIG).map(([key, status]) => ({
          icon: status.icon,
          text: t(`apps.invoiceMaker:statuses.${key}`),
          color: status.color,
          value: key as 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
        }))
      }
    })
    .initialData({
      invoice_number: invoice.invoice_number,
      status: invoice.status || 'draft'
    })
    .onSubmit(async data => {
      await updateMutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}
