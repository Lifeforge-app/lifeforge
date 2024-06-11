import { Icon } from '@iconify/react'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import Input from '@components/ButtonsAndInputs/Input'
import Modal from '@components/Modals/Modal'
import { type IPhotosAlbum } from '@typedec/Photos'
import APIRequest from '@utils/fetchData'
import { usePhotosContext } from '../../../../providers/PhotosProvider'

function ModifyAlbumModal({
  targetAlbum,
  refreshAlbumData
}: {
  targetAlbum?: IPhotosAlbum
  refreshAlbumData?: () => void
}): React.ReactElement {
  const {
    modifyAlbumModalOpenType: openType,
    setModifyAlbumModalOpenType: setOpenType,
    setAlbumList
  } = usePhotosContext()
  const [albumName, setAlbumName] = useState('')
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  const updateAlbumName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setAlbumName(e.target.value)
  }

  async function onSubmitButtonClick(): Promise<void> {
    if (albumName.trim().length === 0) {
      toast.error('Please fill in all the fields.')
      return
    }

    setLoading(true)

    const album = {
      name: albumName.trim()
    }

    await APIRequest({
      endpoint:
        `photos/album/${openType}` +
        (openType === 'rename' ? `/${targetAlbum?.id}` : ''),
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: album,
      successInfo: openType,
      failureInfo: openType,
      callback: data => {
        setOpenType(false)
        setAlbumList(prev => {
          if (typeof prev === 'string') {
            return prev
          }

          return openType === 'create'
            ? [data.data, ...prev]
            : prev.map(album => {
                if (album.id === targetAlbum?.id) {
                  return {
                    ...album,
                    name: albumName
                  }
                }

                return album
              })
        })
        if (refreshAlbumData !== undefined) {
          refreshAlbumData()
        }
      },
      onFailure: () => {
        setOpenType(false)
      },
      finalCallback: () => {
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.focus()
    }

    switch (openType) {
      case 'rename':
        if (targetAlbum !== undefined) {
          setAlbumName(targetAlbum.name)
        }
        break
      case 'create':
        setAlbumName('')
        break
      default:
        break
    }
  }, [openType, targetAlbum])

  return (
    <Modal isOpen={openType !== false}>
      <div className="mb-8 flex items-center justify-between ">
        <h1 className="flex items-center gap-3 text-2xl font-semibold">
          <Icon
            icon={
              {
                create: 'tabler:plus',
                rename: 'tabler:pencil'
              }[openType as 'create' | 'rename']
            }
            className="size-7"
          />
          {typeof openType === 'string' &&
            openType[0].toUpperCase() + openType.slice(1)}{' '}
          album
        </h1>
        <button
          onClick={() => {
            setOpenType(false)
          }}
          className="rounded-md p-2 text-bg-500 transition-all hover:bg-bg-200/50 dark:hover:bg-bg-800"
        >
          <Icon icon="tabler:x" className="size-6" />
        </button>
      </div>
      <Input
        icon="tabler:photo"
        reference={ref}
        name="Album name"
        value={albumName}
        updateValue={updateAlbumName}
        darker
        placeholder="My lovely album"
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onSubmitButtonClick().catch(console.error)
          }
        }}
        autoFocus
      />
      <CreateOrModifyButton
        type={openType as 'create' | 'rename'}
        loading={loading}
        onClick={() => {
          onSubmitButtonClick().catch(console.error)
        }}
      />
    </Modal>
  )
}

export default ModifyAlbumModal
