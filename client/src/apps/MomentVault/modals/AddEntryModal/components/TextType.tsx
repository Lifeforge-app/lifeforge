import forgeAPI from '@utils/forgeAPI'
import { Button, TextAreaInput } from 'lifeforge-ui'
import { useState } from 'react'
import { toast } from 'react-toastify'

function TextType({ onSuccess }: { onSuccess: () => void }) {
  const [text, setText] = useState('')

  const [submitLoading, setSubmitLoading] = useState(false)

  async function onSubmit() {
    setSubmitLoading(true)

    try {
      await forgeAPI.momentVault.entries.create.mutate({
        type: 'text',
        content: text,
        files: undefined
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
        required
        icon="tabler:file-text"
        label="Text Content"
        namespace="apps.momentVault"
        placeholder="What a beautiful day..."
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
