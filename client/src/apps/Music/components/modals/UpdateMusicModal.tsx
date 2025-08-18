import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { FormModal, defineForm } from 'lifeforge-ui'
import { useState } from 'react'
import { toast } from 'react-toastify'

import type { MusicEntry } from '../../providers/MusicProvider'

function UpdateMusicModal({
  data: { initialData },
  onClose
}: {
  data: {
    initialData?: MusicEntry
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const [data, setData] = useState({
    name: initialData?.name || '',
    author: initialData?.author || ''
  })

  const [aiParsingLoading, setAiParsingLoading] = useState(false)

  const mutation = useMutation(
    forgeAPI.music.entries.update
      .input({
        id: initialData?.id || ''
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['music', 'entries']
          })
        },
        onError: error => {
          toast.error(`Failed to update music: ${error.message}`)
        }
      })
  )

  const formProps = defineForm<{
    name: string
    author: string
  }>({
    namespace: 'apps.music',
    icon: 'tabler:pencil',
    title: 'updateMusic',
    submitButton: 'update',
    onClose
  })
    .typesMap({
      name: 'text',
      author: 'text'
    })
    .setupFields({
      name: {
        label: 'Music Name',
        placeholder: "John Doe's Music",
        icon: 'tabler:music',
        required: true,
        actionButtonProps: {
          icon: 'mage:stars-c',
          loading: aiParsingLoading,
          onClick: async () => {
            setAiParsingLoading(true)

            try {
              const response =
                await forgeAPI.music.youtube.parseMusicNameAndAuthor.mutate({
                  title: initialData?.name || '',
                  uploader: initialData?.author || ''
                })

              if (!response) {
                toast.error('Failed to parse music name and author')

                return
              }

              setData({
                name: response.name || '',
                author: response.author || ''
              })
            } catch (error) {
              toast.error(
                `Failed to parse music name and author: ${error instanceof Error ? error.message : String(error)}`
              )
            } finally {
              setAiParsingLoading(false)
            }
          }
        }
      },
      author: {
        label: 'Music Author',
        placeholder: 'John Doe',
        icon: 'tabler:user',
        required: true
      }
    })
    .initialData(initialData)
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return (
    <FormModal
      {...formProps}
      externalData={{
        data,
        setData
      }}
    />
  )
}

export default UpdateMusicModal
