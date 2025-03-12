import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { Button, ModalHeader, ModalWrapper, TextInput } from '@lifeforge/ui'

import { usePhotosContext } from '@modules/Photos/providers/PhotosProvider'

import fetchAPI from '@utils/fetchAPI'

import { type IPhotoAlbumTag } from '../../interfaces/photos_interfaces'

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
}) {
  const { t } = useTranslation('modules.photos')
  const { setAlbumTagList } = usePhotosContext()
  const [tagName, setTagName] = useState('')
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  async function onSubmitButtonClick() {
    if (tagName.trim().length === 0) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    setLoading(true)

    const tag = {
      name: tagName.trim()
    }

    try {
      const data = await fetchAPI<IPhotoAlbumTag>(
        'photos/album/tag' + (openType === 'rename' ? `/${targetTag?.id}` : ''),
        {
          method: openType === 'create' ? 'POST' : 'PATCH',
          body: tag
        }
      )

      setOpenType(false)
      setAlbumTagList(prev => {
        if (typeof prev === 'string') {
          return prev
        }

        return openType === 'create'
          ? [data, ...prev]
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
        setValue={setTagName}
        value={tagName}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onSubmitButtonClick().catch(console.error)
          }
        }}
      />
      <Button
        icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
        loading={loading}
        onClick={() => {
          onSubmitButtonClick().catch(console.error)
        }}
      >
        {openType === 'create' ? 'Create' : 'Rename'}
      </Button>
    </ModalWrapper>
  )
}

export default ModifyAlbumTagsModal
