import { t } from 'i18next'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import Input from '@components/ButtonsAndInputs/Input'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import { type IPhotoAlbumTag } from '@interfaces/photos_interfaces'
import { usePhotosContext } from '@providers/PhotosProvider'
import APIRequest from '@utils/fetchData'

function ModifyAlbumTagsModal({
  openType,
  setOpenType,
  targetTag,
  refreshTagData
}: {
  openType: 'create' | 'rename' | false
  setOpenType: (value: 'create' | 'rename' | false) => void
  targetTag?: IPhotoAlbumTag
  refreshTagData?: () => void
}): React.ReactElement {
  const { setAlbumTagList } = usePhotosContext()
  const [tagName, setTagName] = useState('')
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  const updateTagName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTagName(e.target.value)
  }

  async function onSubmitButtonClick(): Promise<void> {
    if (tagName.trim().length === 0) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    setLoading(true)

    const tag = {
      name: tagName.trim()
    }

    await APIRequest({
      endpoint:
        'photos/album/tag' + (openType === 'rename' ? `/${targetTag?.id}` : ''),
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: tag,
      successInfo: openType,
      failureInfo: openType,
      callback: data => {
        setOpenType(false)
        setAlbumTagList(prev => {
          if (typeof prev === 'string') {
            return prev
          }

          return openType === 'create'
            ? [data.data, ...prev]
            : prev.map(tag => {
                if (tag.id === targetTag?.id) {
                  return {
                    ...tag,
                    name: tagName
                  }
                }

                return tag
              })
        })
        if (refreshTagData !== undefined) {
          refreshTagData()
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
        if (targetTag !== undefined) {
          setTagName(targetTag.name)
        }
        break
      case 'create':
        setTagName('')
        break
      default:
        break
    }
  }, [openType, targetTag])

  return (
    <Modal isOpen={openType !== false} minWidth="40rem">
      <ModalHeader
        title={`${openType === 'create' ? 'Create' : 'Rename'} tag`}
        onClose={() => {
          setOpenType(false)
        }}
        icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
      />
      <Input
        icon="tabler:photo"
        reference={ref}
        name="Tag name"
        value={tagName}
        updateValue={updateTagName}
        darker
        placeholder="My lovely tag"
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

export default ModifyAlbumTagsModal
