import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { CreateOrModifyButton } from '@components/buttons'
import { TextInput } from '@components/inputs'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import { useMusicContext } from '@providers/MusicProvider'
import APIRequest from '@utils/fetchData'

function ModifyMusicModal(): React.ReactElement {
  const { t } = useTranslation('modules.music')
  const {
    isModifyMusicModalOpen: isOpen,
    setIsModifyMusicModalOpen: setOpen,
    existedData: targetMusic,
    setMusics
  } = useMusicContext()
  const [musicName, setMusicName] = useState('')
  const [musicAuthor, setMusicAuthor] = useState('')
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  async function onSubmitButtonClick(): Promise<void> {
    if (musicName.trim().length === 0 || musicAuthor.trim().length === 0) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    setLoading(true)

    const music = {
      name: musicName.trim(),
      author: musicAuthor.trim()
    }

    await APIRequest({
      endpoint: `music/entries/${targetMusic?.id}`,
      method: 'PATCH',
      body: music,
      successInfo: 'update',
      failureInfo: 'update',
      finalCallback: () => {
        setLoading(false)
      },
      callback: () => {
        setOpen(false)
        setMusics(prev => {
          if (typeof prev === 'string') {
            return prev
          }

          return prev.map(music => {
            if (music.id === targetMusic?.id) {
              return {
                ...music,
                name: musicName,
                author: musicAuthor
              }
            }
            return music
          })
        })
      }
    })
  }

  useEffect(() => {
    if (isOpen && ref.current !== null) {
      ref.current.focus()
    }

    if (targetMusic !== null && isOpen) {
      setMusicName(targetMusic.name)
      setMusicAuthor(targetMusic.author)
    }
  }, [isOpen, targetMusic])

  return (
    <ModalWrapper isOpen={isOpen}>
      <ModalHeader
        icon="tabler:pencil"
        title={t('music.updateMusic')}
        onClose={() => {
          setOpen(false)
        }}
      />
      <TextInput
        ref={ref}
        darker
        className="w-[40rem]"
        icon="tabler:music"
        name="Music name"
        namespace="modules.music"
        placeholder="My lovely music"
        updateValue={setMusicName}
        value={musicName}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onSubmitButtonClick().catch(console.error)
          }
        }}
      />
      <TextInput
        darker
        className="mt-6 w-[40rem]"
        icon="tabler:user"
        name="Author"
        namespace="modules.music"
        placeholder="John Doe"
        updateValue={setMusicAuthor}
        value={musicAuthor}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onSubmitButtonClick().catch(console.error)
          }
        }}
      />
      <CreateOrModifyButton
        loading={loading}
        type="rename"
        onClick={() => {
          onSubmitButtonClick().catch(console.error)
        }}
      />
    </ModalWrapper>
  )
}

export default ModifyMusicModal
