import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { fetchAPI, useAPIEndpoint } from 'shared/lib'

import { Button } from '@components/buttons'

import TextAreaInput from '../../../TextAreaInput'

function AIImageGenerator({
  file,
  setFile,
  setPreview,
  defaultPrompt
}: {
  file: string | File | null
  setFile: React.Dispatch<React.SetStateAction<string | File | null>>
  setPreview: React.Dispatch<React.SetStateAction<string | null>>
  defaultPrompt: string
}) {
  const apiHost = useAPIEndpoint()

  const [prompt, setPrompt] = useState('')

  const [loading, setLoading] = useState(false)

  async function onSubmit() {
    if (prompt === '') {
      toast.error('Please enter a prompt')

      return
    }

    setLoading(true)

    try {
      const response = await fetchAPI<string>(
        apiHost,
        '/ai/image-generation/generate-image',
        {
          method: 'POST',
          body: { prompt }
        }
      )

      setFile(response)
      setPreview(response)
    } catch {
      toast.error('Failed to generate image')
    }
  }

  useEffect(() => {
    setPrompt(defaultPrompt)
  }, [defaultPrompt])

  return !file ? (
    <>
      <TextAreaInput
        darker
        required
        icon="tabler:edit"
        name="Prompt"
        namespace="common.modals"
        placeholder="A description of the image you want to generate"
        setValue={setPrompt}
        tKey="imagePicker"
        value={prompt}
      />
      <Button
        className="mt-6 w-full"
        disabled={prompt === ''}
        icon="mage:stars-c"
        loading={loading}
        onClick={onSubmit}
      >
        Generate
      </Button>
    </>
  ) : (
    <div>
      <div className="bg-bg-200 shadow-custom dark:bg-bg-800/50 flex h-96 w-full items-center justify-center rounded-lg p-8">
        <img
          alt=""
          className="h-full rounded-lg object-contain"
          src={file as string}
        />
      </div>
      <Button
        className="mt-6 w-full"
        icon="tabler:refresh"
        variant="secondary"
        onClick={() => {
          setFile(null)
          setPreview(null)
        }}
      >
        Regenerate
      </Button>
    </div>
  )
}

export default AIImageGenerator
