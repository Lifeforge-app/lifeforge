import fetchAPI from '@utils/fetchAPI'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import {
  CreateOrModifyButton,
  ModalHeader,
  ModalWrapper,
  TextInput
} from '@lifeforge/ui'

import { usePhotosContext } from '@modules/Photos/providers/PhotosProvider'

import { type IPhotosAlbum } from '../../interfaces/photos_interfaces'

function ModifyAlbumModal({
  targetAlbum,
  refreshAlbumData
}: {
  targetAlbum?: IPhotosAlbum
  refreshAlbumData?: () => void
}): React.ReactElement {
  const { t } = useTranslation('modules.photos')
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

    try {
      const data = await fetchAPI<IPhotosAlbum>(
        `photos/album/${openType}` +
          (openType === 'rename' ? `/${targetAlbum?.id}` : ''),
        {
          method: openType === 'create' ? 'POST' : 'PATCH',
          body: album
        }
      )

      setOpenType(false)
      setAlbumList(prev => {
        if (typeof prev === 'string') {
          return prev
        }

        return openType === 'create'
          ? [data, ...prev]
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
    } catch {
      toast.error(t('input.error.failed'))
    } finally {
      setLoading(false)
    }
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
        icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
        title={`${openType === 'create' ? 'Create' : 'Rename'} album`}
        onClose={() => {
          setOpenType(false)
        }}
      />
      <TextInput
        ref={ref}
        darker
        icon="tabler:photo"
        name="Album name"
        namespace="modules.photos"
        placeholder="My lovely album"
        setValue={setAlbumName}
        value={albumName}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onSubmitButtonClick().catch(console.error)
          }
        }}
      />
      <CreateOrModifyButton
        loading={loading}
        type={openType as 'create' | 'rename'}
        onClick={() => {
          onSubmitButtonClick().catch(console.error)
        }}
      />
    </ModalWrapper>
  )
}

export default ModifyAlbumModal
