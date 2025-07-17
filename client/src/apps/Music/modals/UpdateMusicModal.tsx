import { useQueryClient } from '@tanstack/react-query'
import { Button, ModalHeader, TextInput } from 'lifeforge-ui'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import fetchAPI from '@utils/fetchAPI'

import { IMusicEntry } from '../interfaces/music_interfaces'

function UpdateMusicModal({
  data: { existedData },
  onClose
}: {
  data: {
    existedData: IMusicEntry | null
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const { t } = useTranslation('apps.music')

  const [musicName, setMusicName] = useState('')
  const [musicAuthor, setMusicAuthor] = useState('')
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  async function onSubmitButtonClick() {
    if (musicName.trim().length === 0 || musicAuthor.trim().length === 0) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    setLoading(true)

    const music = {
      name: musicName.trim(),
      author: musicAuthor.trim()
    }

    try {
      await fetchAPI(`music/entries/${existedData?.id}`, {
        method: 'PATCH',
        body: music
      })

      queryClient.setQueryData<IMusicEntry[]>(['music', 'entries'], prev => {
        if (!prev) return prev

        return prev.map(music => {
          if (music.id === existedData?.id) {
            return {
              ...music,
              name: musicName,
              author: musicAuthor
            }
          }
          return music
        })
      })

      onClose()
    } catch {
      toast.error('Failed to update music data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.focus()
    }

    if (existedData !== null) {
      setMusicName(existedData.name)
      setMusicAuthor(existedData.author)
    }
  }, [existedData])

  return (
    <>
      <ModalHeader
        icon="tabler:pencil"
        title={t('music.updateMusic')}
        onClose={onClose}
      />
      <TextInput
        ref={ref}
        darker
        className="w-[40rem]"
        icon="tabler:music"
        name="Music name"
        namespace="apps.music"
        placeholder="My lovely music"
        setValue={setMusicName}
        value={musicName}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onSubmitButtonClick().catch(console.error)
          }
        }}
      />
      <TextInput
        darker
        className="mt-4 w-[40rem]"
        icon="tabler:user"
        name="Author"
        namespace="apps.music"
        placeholder="John Doe"
        setValue={setMusicAuthor}
        value={musicAuthor}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onSubmitButtonClick().catch(console.error)
          }
        }}
      />
      <Button
        className="mt-6 w-full"
        icon="tabler:pencil"
        loading={loading}
        onClick={() => {
          onSubmitButtonClick().catch(console.error)
        }}
      >
        Rename
      </Button>
    </>
  )
}

export default UpdateMusicModal
