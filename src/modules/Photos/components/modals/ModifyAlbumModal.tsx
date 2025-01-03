import { t } from 'i18next'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import Input from '@components/ButtonsAndInputs/Input'
import ModalWrapper from '@components/Modals/ModalWrapper'
import ModalHeader from '@components/Modals/ModalHeader'
import { type IPhotosAlbum } from '@interfaces/photos_interfaces'
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

  async function onSubmitButtonClick(): Promise<void> {
    if (albumName.trim().length === 0) {
      toast.error(t('input.error.fieldEmpty'))
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
    <ModalWrapper isOpen={openType !== false} minWidth="40rem">
      <ModalHeader
        title={`${openType === 'create' ? 'Create' : 'Rename'} album`}
        onClose={() => {
          setOpenType(false)
        }}
        icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
      />
      <Input
        icon="tabler:photo"
        ref={ref}
        name="Album name"
        value={albumName}
        updateValue={setAlbumName}
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
    </ModalWrapper>
  )
}

export default ModifyAlbumModal
