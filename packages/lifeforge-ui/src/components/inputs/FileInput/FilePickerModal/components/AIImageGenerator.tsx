import forgeAPI from '@/utils/forgeAPI'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useAPIEndpoint, usePromiseLoading } from 'shared'

import { EmptyStateScreen } from '@components/feedback'
import { Button } from '@components/inputs'
import { WithQueryData } from '@components/utilities'

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

  const [loading, onSubmit] = usePromiseLoading(async () => {
    if (prompt === '') {
      toast.error('Please enter a prompt')

      return
    }

    try {
      const response = await forgeAPI
        .untyped('/ai/imageGeneration/generateImage')
        .setHost(apiHost)
        .mutate({
          prompt
        })

      setFile(response)
      setPreview(response)
    } catch {
      toast.error('Failed to generate image')
    }
  })

  useEffect(() => {
    setPrompt(defaultPrompt)
  }, [defaultPrompt])

  return (
    <WithQueryData
      controller={forgeAPI
        .untyped('/apiKeys/entries/checkKeys')
        .setHost(apiHost)
        .input({ keys: 'openai' })}
    >
      {keyExists =>
        keyExists ? (
          !file ? (
            <>
              <TextAreaInput
                required
                icon="tabler:edit"
                label="imagePicker.inputs.prompt"
                namespace="common.modals"
                placeholder="A description of the image you want to generate"
                value={prompt}
                onChange={setPrompt}
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
        ) : (
          <EmptyStateScreen
            icon="tabler:robot-off"
            message={{
              id: 'noOpenAIKey',
              namespace: 'common.modals',
              tKey: 'imagePicker'
            }}
          />
        )
      }
    </WithQueryData>
  )
}

export default AIImageGenerator
