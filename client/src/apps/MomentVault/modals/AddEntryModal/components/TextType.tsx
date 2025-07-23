import { Button, TextAreaInput } from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { fetchAPI } from 'shared'

function TextType({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useTranslation('apps.momentVault')

  const [text, setText] = useState('')

  const [submitLoading, setSubmitLoading] = useState(false)

  async function onSubmit() {
    setSubmitLoading(true)

    try {
      await fetchAPI(import.meta.env.VITE_API_HOST, 'moment-vault/entries', {
        method: 'POST',
        body: {
          type: 'text',
          content: text
        }
      })

      onSuccess()
    } catch (err) {
      console.error(err)
      toast.error('Failed to create text entry')
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <>
      <TextAreaInput
        darker
        required
        icon="tabler:file-text"
        name="Text Content"
        namespace="apps.momentVault"
        placeholder={t('apps.momentVault:placeholders.textEntry')}
        setValue={setText}
        value={text}
      />
      <Button
        className="mt-6 w-full"
        disabled={text.trim().length === 0}
        icon="tabler:plus"
        loading={submitLoading}
        onClick={onSubmit}
      >
        Create
      </Button>
    </>
  )
}

export default TextType
