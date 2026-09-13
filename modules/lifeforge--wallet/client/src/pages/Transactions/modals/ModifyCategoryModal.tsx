import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  ColorField,
  FormModal,
  IconField,
  ListboxField,
  TAILWIND_PALETTE,
  TextField,
  createDefaultValues
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { WalletCategory } from '..'

const schema = z.object({
  type: z.enum(['income', 'expenses']),
  name: z.string().min(1, 'Category name is required'),
  icon: z.string().min(1, 'Category icon is required'),
  color: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      'Color must be a valid hex color (e.g. #FF0000)'
    )
})

function ModifyCategoryModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: Partial<WalletCategory>
  }
  onClose: () => void
}) {
  const { t } = useModuleTranslation()

  const createMutation = useForgeMutation(forgeAPI.categories.create, {
    action: 'create',
    queryKey: forgeAPI.categories.key
  })

  const updateMutation = useForgeMutation(
    forgeAPI.categories.update.input({ id: initialData?.id || ''! }),
    { action: 'update', queryKey: forgeAPI.categories.key }
  )

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      ...initialData
    },
    mode: 'all',
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        handler: data => {
          ;(type === 'create' ? createMutation : updateMutation).mutateAsync(
            data
          )
        },
        template: type === 'update' ? 'update' : 'create'
      }}
      uiConfig={{
        icon: type === 'update' ? 'tabler:pencil' : 'tabler:plus',
        title: `categories.${type === 'update' ? 'update' : 'create'}`,
        onClose
      }}
    >
      <ListboxField
        required
        control={form.control}
        disabled={type === 'update'}
        icon="tabler:apps"
        label="categoryType"
        name="type"
        options={[
          {
            value: 'income',
            text: t('transactionTypes.income'),
            icon: 'tabler:login-2',
            color: TAILWIND_PALETTE.green[500]
          },
          {
            value: 'expenses',
            text: t('transactionTypes.expenses'),
            icon: 'tabler:logout',
            color: TAILWIND_PALETTE.red[500]
          }
        ]}
      />
      <TextField
        required
        control={form.control}
        icon="tabler:pencil"
        label="categoryName"
        name="name"
        placeholder={t('inputs.categoryName.placeholder')}
      />
      <IconField
        required
        control={form.control}
        label="categoryIcon"
        name="icon"
      />
      <ColorField
        required
        control={form.control}
        label="categoryColor"
        name="color"
      />
    </FormModal>
  )
}

export default ModifyCategoryModal
