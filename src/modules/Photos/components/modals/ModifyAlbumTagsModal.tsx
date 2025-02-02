/* eslint-disable sonarjs/no-nested-functions */

import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { CreateOrModifyButton } from '@components/buttons'
import { TextInput } from '@components/inputs'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
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
  const { t } = useTranslation('modules.photos')
  const { setAlbumTagList } = usePhotosContext()
  const [tagName, setTagName] = useState('')
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

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
    <ModalWrapper isOpen={openType !== false} minWidth="40rem">
      <ModalHeader
        icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
        title={`${openType === 'create' ? 'Create' : 'Rename'} tag`}
        onClose={() => {
          setOpenType(false)
        }}
      />
      <TextInput
        ref={ref}
        darker
        icon="tabler:photo"
        name="Tag name"
        namespace="modules.photos"
        placeholder="My lovely tag"
        updateValue={setTagName}
        value={tagName}
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

export default ModifyAlbumTagsModal
