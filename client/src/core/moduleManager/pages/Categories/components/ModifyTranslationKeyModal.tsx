import { FormModal, defineForm } from 'lifeforge-ui'
import { toast } from 'react-toastify'

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
  const { formProps } = defineForm<{ key: string }>({
    icon: 'tabler:plus',
    title: `translationKey.${openType}`,
    submitButton: openType,
    onClose,
    namespace: 'common.moduleManager'
  })
    .typesMap({
      key: 'text'
    })
    .setupFields({
      key: {
        icon: 'mingcute:translate-line',
        placeholder: 'e.g. en, ms, zh-CN, zh-TW, etc.',
        label: 'Translation Key',
        required: true
      }
    })
    .initialData({
      key
    })
    .onSubmit(async ({ key }) => {
      try {
        onSubmit(key)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Something went wrong')
        throw e
      }
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyTranslationKeyModal
