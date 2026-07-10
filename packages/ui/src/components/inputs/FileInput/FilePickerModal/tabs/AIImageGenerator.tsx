import { useEffect, useState } from 'react'

import { useAPIEndpoint, usePromiseLoading } from '@lifeforge/api'

import { EmptyStateScreen } from '@/components/feedback'
import { Button, TextAreaInput } from '@/components/inputs'
import { Box, Flex } from '@/components/primitives'
import { WithQueryData } from '@/components/utilities'
import { toast } from '@/providers'
import { forgeAPI } from '@/utils/forgeAPI'

import { useFilePicker } from '../contexts/FilePickerContext'

export function AIImageGenerator() {
  const apiHost = useAPIEndpoint()
  const [prompt, setPrompt] = useState('')
  const { file, setFile, setPreview, sources } = useFilePicker()

  const defaultPrompt = sources.ai ? sources.ai.defaultPrompt : ''

  const [loading, onSubmit] = usePromiseLoading(async () => {
    if (prompt === '') {
      toast.error('Please enter a prompt')

      return
    }

    try {
      const response = await forgeAPI.ai.imageGeneration.generateImage
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
      contract={forgeAPI.checkAPIKeys({ keys: 'openai' }).setHost(apiHost)}
    >
      {keyExists =>
        keyExists ? (
          !file ? (
            <>
              <TextAreaInput
                required
                icon="tabler:pencil"
                label="imagePicker.inputs.prompt"
                namespace="common.modals"
                placeholder="A description of the image you want to generate"
                value={prompt}
                onChange={setPrompt}
              />
              <Button
                disabled={prompt === ''}
                icon="mage:stars-c"
                loading={loading}
                style={{ marginTop: '1.5rem', width: '100%' }}
                onClick={onSubmit}
              >
                Generate
              </Button>
            </>
          ) : (
            <Box>
              <Flex
                shadow
                align="center"
                bg={{ base: 'bg-200', dark: 'bg-800' }}
                justify="center"
                p="xl"
                r="lg"
                style={{ height: '24rem' }}
                width="100%"
              >
                <Box
                  asChild
                  r="lg"
                  style={{ height: '100%', objectFit: 'contain' }}
                >
                  <img alt="" src={file as string} />
                </Box>
              </Flex>
              <Button
                icon="tabler:refresh"
                style={{ marginTop: '1.5rem', width: '100%' }}
                variant="secondary"
                onClick={() => {
                  setFile(null)
                  setPreview(null)
                }}
              >
                Regenerate
              </Button>
            </Box>
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
