import { Icon } from '@iconify/react'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import Input from '@components/ButtonsAndInputs/Input'
import Modal from '@components/Modals/Modal'
import { useMusicContext } from '@providers/MusicProvider'
import APIRequest from '@utils/fetchData'

function ModifyMusicModal(): React.ReactElement {
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

  const updateMusicName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setMusicName(e.target.value)
  }

  const updateMusicAuthor = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setMusicAuthor(e.target.value)
  }

  async function onSubmitButtonClick(): Promise<void> {
    if (musicName.trim().length === 0 || musicAuthor.trim().length === 0) {
      toast.error('Please fill in all the fields.')
      return
    }

    setLoading(true)

    const music = {
      name: musicName.trim(),
      author: musicAuthor.trim()
    }

    await APIRequest({
      endpoint: `music/entry/update/${targetMusic?.id}`,
      method: 'PATCH',
      body: music,
      successInfo: `Yay! Music ${musicName} has been updated.`,
      failureInfo: "Oops! Couldn't update the music. Please try again.",
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
    <Modal isOpen={isOpen}>
      <div className="mb-8 flex items-center justify-between ">
        <h1 className="flex items-center gap-3 text-2xl font-semibold">
          <Icon icon="tabler:pencil" className="h-7 w-7" />
          Update music
        </h1>
        <button
          onClick={() => {
            setOpen(false)
          }}
          className="rounded-md p-2 text-bg-500 transition-all hover:bg-bg-200/50 hover: dark:hover:bg-bg-800"
        >
          <Icon icon="tabler:x" className="h-6 w-6" />
        </button>
      </div>
      <Input
        icon="tabler:music"
        reference={ref}
        name="Music name"
        value={musicName}
        updateValue={updateMusicName}
        darker
        placeholder="My lovely music"
        additionalClassName="w-[40rem]"
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onSubmitButtonClick().catch(console.error)
          }
        }}
        autoFocus
      />
      <Input
        icon="tabler:user"
        name="Author"
        value={musicAuthor}
        updateValue={updateMusicAuthor}
        darker
        placeholder="John Doe"
        additionalClassName="w-[40rem] mt-6"
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onSubmitButtonClick().catch(console.error)
          }
        }}
      />
      <CreateOrModifyButton
        type="rename"
        loading={loading}
        onClick={() => {
          onSubmitButtonClick().catch(console.error)
        }}
      />
    </Modal>
  )
}

export default ModifyMusicModal
