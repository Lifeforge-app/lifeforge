import { useState } from 'react'

import { Button, TextAreaInput, toast } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

function TextType({ onSuccess }: { onSuccess: () => void }) {
  const [text, setText] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  async function onSubmit() {
    setSubmitLoading(true)

    try {
      await forgeAPI.entries.create.mutate({
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
        placeholder="What a beautiful day..."
        value={text}
        onChange={setText}
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
