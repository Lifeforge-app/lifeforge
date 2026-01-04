import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FormModal, defineForm } from 'lifeforge-ui'
import { type InferInput, getFormFileFieldInitialData } from 'shared'

import forgeAPI from '../utils/forgeAPI'

export default function ModifySettingsModal({
  onClose
}: {
  onClose: () => void
}) {
  const qc = useQueryClient()

  const settingsQuery = useQuery(
    forgeAPI.melvinchia3636$invoice_maker.settings.get.queryOptions()
  )

  const mutation = useMutation(
    forgeAPI.melvinchia3636$invoice_maker.settings.update.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['invoiceMaker', 'settings'] })
        onClose()
      }
    })
  )

  if (!settingsQuery.data) {
    return null
  }

  const { formProps } = defineForm<
    InferInput<
      typeof forgeAPI.melvinchia3636$invoice_maker.settings.update
    >['body']
  >({
    title: 'Settings',
    icon: 'tabler:settings',
    namespace: 'apps.melvinchia3636__invoiceMaker',
    onClose,
    submitButton: {
      icon: 'tabler:device-floppy',
      children: 'Save'
    },
    loading: !settingsQuery.data
  })
    .typesMap({
      company_name: 'text',
      company_additional_info: 'textarea',
      default_logo: 'file',
      default_payment_terms: 'text',
      default_notes: 'textarea',
      default_tax_rate: 'number',
      bank_name: 'text',
      bank_account: 'text',
      currency: 'text',
      currency_symbol: 'text',
      invoice_prefix: 'text',
      next_invoice_number: 'number'
    })
    .setupFields({
      company_name: {
        icon: 'tabler:building',
        label: 'Company Name',
        placeholder: 'Your Company Name'
      },
      company_additional_info: {
        icon: 'tabler:briefcase',
        label: 'Company Additional Info',
        placeholder: 'e.g. Your Trusted Partner'
      },
      default_logo: {
        optional: true,
        icon: 'tabler:photo',
        label: 'Default Logo'
      },
      default_payment_terms: {
        icon: 'tabler:calendar-due',
        label: 'Default Payment Terms',
        placeholder: 'e.g. Net 30'
      },
      default_notes: {
        icon: 'tabler:notes',
        label: 'Default Notes',
        placeholder: 'Payment instructions, late fees, etc.'
      },
      default_tax_rate: {
        icon: 'tabler:receipt-tax',
        label: 'Default Tax Rate (%)'
      },
      bank_name: {
        icon: 'tabler:building-bank',
        label: 'Bank Name',
        placeholder: 'e.g. Maybank Islamic'
      },
      bank_account: {
        icon: 'tabler:credit-card',
        label: 'Bank Account',
        placeholder: 'e.g. 1234 5678 9012'
      },
      currency: {
        icon: 'tabler:currency-dollar',
        label: 'Currency',
        placeholder: 'e.g. MYR'
      },
      currency_symbol: {
        icon: 'tabler:currency',
        label: 'Currency Symbol',
        placeholder: 'e.g. RM'
      },
      invoice_prefix: {
        icon: 'tabler:hash',
        label: 'Invoice Prefix',
        placeholder: 'e.g. INV-'
      },
      next_invoice_number: {
        icon: 'tabler:123',
        label: 'Next Invoice Number'
      }
    })
    .initialData({
      ...settingsQuery.data,
      default_logo: getFormFileFieldInitialData(
        forgeAPI,
        settingsQuery.data,
        settingsQuery.data.default_logo
      )
    })
    .onSubmit(async data => {
      console.log(data)
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}
