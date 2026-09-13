import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  FormModal,
  TextAreaField,
  createDefaultValues,
  toast,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { WalletTransaction } from '..'
import CreateAnotherField, {
  type CreateAnotherValue,
  createAnotherSchema
} from '../components/CreateAnotherFIeld'
import ConfirmMultipleTransactionsModal from './ConfirmMultipleTransactionsModal'
import ModifyTransactionsModal from './ModifyTransactionsModal'

const schema = z.object({
  description: z.string().min(1, 'Description is required'),
  createAnother: createAnotherSchema
})

function NaturalLanguageModal({
  onClose,
  data: { createAnother = 'none' }
}: {
  onClose: () => void
  data: {
    createAnother?: CreateAnotherValue
  }
}) {
  const { open } = useModalStore()
  const { t } = useModuleTranslation()

  const mutation = useForgeMutation(forgeAPI.transactions.fromNaturalLanguage, {
    action: t('actions.convert')
  })

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      createAnother
    },
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        handler: async values => {
          const data = await mutation.mutateAsync({
            description: values.description
          })

          onClose()

          if (data.length === 1) {
            open(ModifyTransactionsModal, {
              type: 'create',
              createAnother: values.createAnother,
              initialData: data[0] as unknown as {
                type: WalletTransaction['type']
              } & Partial<WalletTransaction>
            })
          } else if (data.length > 1) {
            open(ConfirmMultipleTransactionsModal, {
              transactions: data
            })
          } else {
            toast.error(t('toasts.noTransactionsExtracted'))
          }
        },
        label: 'proceed',
        icon: 'tabler:arrow-right'
      }}
      uiConfig={{
        icon: 'tabler:brain',
        namespace: 'apps.lifeforge--wallet',
        title: 'naturalLanguage.title',
        onClose
      }}
    >
      <TextAreaField
        required
        control={form.control}
        icon="tabler:message"
        label="description.label"
        name="description"
        placeholder={t('inputs.description.placeholder')}
      />
      <CreateAnotherField control={form.control} />
    </FormModal>
  )
}

export default NaturalLanguageModal
