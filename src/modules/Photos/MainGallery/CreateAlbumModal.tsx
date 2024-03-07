import React, { useContext, useEffect, useState } from 'react'
import Modal from '../../../components/general/Modal'
import { Icon } from '@iconify/react/dist/iconify.js'
import Input from '../../../components/general/Input'
import CreateOrModifyButton from '../../../components/general/CreateOrModifyButton'
import { toast } from 'react-toastify'
import { cookieParse } from 'pocketbase'
import { PhotosContext } from '..'

function CreateAlbumModal(): React.ReactElement {
  const {
    isCreateAlbumModalOpen: isOpen,
    setCreateAlbumModalOpen: setOpen,
    refreshAlbumList: updateAlbumList
  } = useContext(PhotosContext)
  const [albumName, setAlbumName] = useState('')
  const [loading, setLoading] = useState(false)

  const updateAlbumName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setAlbumName(e.target.value)
  }

  function onSubmitButtonClick(): void {
    if (albumName.trim().length === 0) {
      toast.error('Please fill in all the fields.')
      return
    }

    setLoading(true)

    const album = {
      name: albumName.trim()
    }

    fetch(`${import.meta.env.VITE_API_HOST}/photos/album/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
      },
      body: JSON.stringify(album)
    })
      .then(async res => {
        const data = await res.json()
        if (!res.ok) {
          throw data.message
        }
        toast.success('Yay! Album created. Time to fill it up.')
        setOpen(false)
        updateAlbumList()
      })
      .catch(err => {
        toast.error("Oops! Couldn't create the album. Please try again.")
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (isOpen) {
      setAlbumName('')
    }
  }, [isOpen])

  return (
    <Modal isOpen={isOpen}>
      <div className="mb-8 flex items-center justify-between ">
        <h1 className="flex items-center gap-3 text-2xl font-semibold">
          <Icon icon="tabler:plus" className="h-7 w-7" />
          Create album
        </h1>
        <button
          onClick={() => {
            setOpen(false)
          }}
          className="rounded-md p-2 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:text-bg-100 dark:hover:bg-bg-800"
        >
          <Icon icon="tabler:x" className="h-6 w-6" />
        </button>
      </div>
      <Input
        icon="tabler:photo"
        name="Album name"
        value={albumName}
        updateValue={updateAlbumName}
        darker
        placeholder="My lovely album"
        additionalClassName="w-[40rem]"
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onSubmitButtonClick()
          }
        }}
      />
      <CreateOrModifyButton
        type="create"
        loading={loading}
        onClick={onSubmitButtonClick}
      />
    </Modal>
  )
}

export default CreateAlbumModal
