import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

import { FormModal, TextField, createDefaultValues } from '@lifeforge/ui'

const schema = z.object({
  key: z
    .string()
    .min(1, 'Language code is required')
    .regex(
      /^[a-z]{2,3}(-[A-Z]{2})?$/,
      'Must be a valid language code (e.g. en, ms, zh-CN)'
    )
})

function ModifyTranslationKeyModal({
  onClose,
  data: { openType, key, onSubmit }
}: {
  onClose: () => void
  data: {
    openType: 'create' | 'update'
    key?: string
    onSubmit: (key: string) => void
  }
}) {
  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      key: key || ''
    },
    mode: 'all',
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        handler: async ({ key }) => {
          try {
            onSubmit(key)
          } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Something went wrong')
            throw e
          }
        },
        template: openType
      }}
      uiConfig={{
        icon: 'tabler:plus',
        namespace: 'common.moduleManager',
        title: `translationKey.${openType}`,
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="mingcute:translate-line"
        label="Language Code"
        name="key"
        placeholder="e.g. en, ms, zh-CN, zh-TW, etc."
      />
    </FormModal>
  )
}

export default ModifyTranslationKeyModal
