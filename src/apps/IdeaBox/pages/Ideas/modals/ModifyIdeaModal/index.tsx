import { useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'

import { Button, QueryWrapper, TagsInput } from '@lifeforge/ui'

import { IIdeaBoxEntry } from '@apps/IdeaBox/interfaces/ideabox_interfaces'
import { useIdeaBoxContext } from '@apps/IdeaBox/providers/IdeaBoxProvider'

import fetchAPI from '@utils/fetchAPI'

import IdeaContentInput from './components/IdeaContentInput'
import ModalHeader from './components/ModalHeader'

function ModifyIdeaModal({
  data: { type, ideaType, existedData, pastedData },
  onClose
}: {
  data: {
    type: 'create' | 'update' | 'paste'
    ideaType: IIdeaBoxEntry['type']
    existedData: IIdeaBoxEntry | null
    pastedData: { file: File; preview: string } | null
  }
  onClose: () => void
}) {
  const { viewArchived, selectedTags, debouncedSearchQuery, tagsQuery } =
    useIdeaBoxContext()
  const { id, '*': path } = useParams<{ id: string; '*': string }>()
  const innerOpenType = useDebounce(type, type === null ? 300 : 0)
  const [innerTypeOfModifyIdea, setInnerTypeOfModifyIdea] =
    useState<IIdeaBoxEntry['type']>('text')
  const [ideaTitle, setIdeaTitle] = useState('')
  const [ideaContent, setIdeaContent] = useState('')
  const [ideaLink, setIdeaLink] = useState('')
  const [ideaImage, setIdeaImage] = useState<File | null>(null)
  const [imageLink, setImageLink] = useState<string>('')
  const [ideaTags, setIdeaTags] = useState<string[]>([])
  const debouncedImageLink = useDebounce(imageLink, 500)
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null)
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = new FileReader()

    file.onload = function () {
      setPreview(file.result)
    }

    file.readAsDataURL(acceptedFiles[0])
    setIdeaImage(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop
  })

  useEffect(() => {
    setInnerTypeOfModifyIdea(ideaType)
  }, [ideaType])

  useEffect(() => {
    if (innerOpenType === 'create') {
      setIdeaTitle('')
      setIdeaContent('')
      setIdeaLink('')
      setIdeaImage(null)
      setImageLink('')
      setPreview(null)
      setIdeaTags([])
    } else if (innerOpenType === 'update') {
      if (existedData !== null) {
        setIdeaTitle(existedData.title)
        setIdeaContent(existedData.content)
        setIdeaLink(existedData.content)
        setImageLink('')
        setIdeaImage(null)
        setPreview(null)
        setIdeaTags(existedData.tags ?? [])
      }
    } else if (innerOpenType === 'paste' && pastedData !== null) {
      setIdeaTitle('')
      setIdeaContent('')
      setIdeaLink('')
      setIdeaImage(pastedData.file)
      setImageLink('')
      setPreview(pastedData.preview)
      setIdeaTags([])
    }
  }, [existedData, innerOpenType])

  useEffect(() => {
    if (innerTypeOfModifyIdea === 'image') {
      if (debouncedImageLink === '') {
        setPreview(null)
        return
      }

      if (!debouncedImageLink.match(/^http(s)?:\/\/.+/)) {
        toast.error('Invalid image link.')
        return
      }

      fetch(debouncedImageLink, {
        method: 'HEAD'
      })
        .then(response => {
          if (response.ok) {
            setPreview(debouncedImageLink)
          } else {
            toast.error('Invalid image link.')
          }
        })
        .catch(() => {
          toast.error('Invalid image link.')
        })
    }
  }, [debouncedImageLink])

  async function onSubmitButtonClick() {
    switch (innerTypeOfModifyIdea) {
      case 'text':
        if (ideaContent.trim().length === 0) {
          toast.error('Idea content cannot be empty.')
          return
        }
        break
      case 'image':
        if (
          innerOpenType === 'create' &&
          ideaImage === null &&
          debouncedImageLink.trim().length === 0
        ) {
          toast.error('Idea image cannot be empty.')
          return
        }
        break
      case 'link':
        if (ideaLink.trim().length === 0) {
          toast.error('Idea title and link cannot be empty.')
          return
        }
        break
    }

    setLoading(true)

    const formData = new FormData()
    formData.append('container', id ?? '')
    formData.append('title', ideaTitle.trim())
    formData.append(
      'content',
      innerTypeOfModifyIdea === 'text' ? ideaContent.trim() : ideaLink.trim()
    )
    formData.append('image', ideaImage!)
    formData.append('imageLink', debouncedImageLink)
    formData.append('type', innerTypeOfModifyIdea)
    formData.append('folder', path?.split('/').pop() ?? '')
    formData.append('tags', JSON.stringify(ideaTags))

    try {
      await fetchAPI<IIdeaBoxEntry>(
        `idea-box/ideas/${innerOpenType === 'update' ? existedData?.id : ''}`,
        {
          method: innerOpenType === 'update' ? 'PATCH' : 'POST',
          body:
            innerOpenType === 'update'
              ? {
                  title: ideaTitle.trim(),
                  content:
                    innerTypeOfModifyIdea === 'text'
                      ? ideaContent.trim()
                      : ideaLink.trim(),
                  type: innerTypeOfModifyIdea,
                  tags: ideaTags
                }
              : formData
        }
      )

      queryClient.invalidateQueries({
        queryKey: ['idea-box', 'ideas', id, path, viewArchived]
      })
      queryClient.invalidateQueries({
        queryKey: [
          'idea-box',
          'search',
          id,
          path,
          selectedTags,
          debouncedSearchQuery
        ]
      })

      queryClient.invalidateQueries({ queryKey: ['idea-box', 'tags', id] })
      onClose()
    } catch {
      toast.error(`Failed to ${innerOpenType} idea`)
    } finally {
      setLoading(false)
    }
  }

  function onPasteImage(event: ClipboardEvent) {
    const items = event.clipboardData?.items

    let pastedImage: DataTransferItem | undefined

    for (let i = 0; i < items!.length; i++) {
      if (items![i].type.includes('image')) {
        pastedImage = items![i]
        break
      }
    }

    if (pastedImage === undefined) {
      return
    }

    if (!pastedImage.type.includes('image')) {
      toast.error('Invalid image in clipboard.')
      return
    }

    const file = pastedImage.getAsFile()
    const reader = new FileReader()

    reader.onload = function () {
      setPreview(reader.result)
    }

    if (file) {
      reader.readAsDataURL(file)
      setIdeaImage(file)
    }
  }

  useEffect(() => {
    if (innerTypeOfModifyIdea === 'image') {
      document.addEventListener('paste', onPasteImage)
    }

    return () => {
      document.removeEventListener('paste', onPasteImage)
    }
  }, [innerTypeOfModifyIdea])

  return (
    <div className="min-w-[60vw]">
      <ModalHeader
        innerOpenType={(() => {
          switch (innerOpenType) {
            case null:
            case 'update':
              return innerOpenType
            default:
              return 'create'
          }
        })()}
        innerTypeOfModifyIdea={innerTypeOfModifyIdea}
        setInnerTypeOfModifyIdea={setInnerTypeOfModifyIdea}
        onClose={onClose}
      />
      <div className="space-y-4">
        <IdeaContentInput
          debouncedImageLink={debouncedImageLink}
          getInputProps={getInputProps}
          getRootProps={getRootProps}
          ideaContent={ideaContent}
          ideaImage={ideaImage}
          ideaLink={ideaLink}
          ideaTitle={ideaTitle}
          imageLink={imageLink}
          innerOpenType={innerOpenType}
          innerTypeOfModifyIdea={innerTypeOfModifyIdea}
          isDragActive={isDragActive}
          preview={preview}
          setIdeaContent={setIdeaContent}
          setIdeaImage={setIdeaImage}
          setIdeaLink={setIdeaLink}
          setIdeaTitle={setIdeaTitle}
          setImageLink={setImageLink}
          setPreview={setPreview}
        />
        <QueryWrapper query={tagsQuery}>
          {tags => (
            <TagsInput
              darker
              className="mt-6"
              existedTags={tags}
              icon="tabler:tag"
              name="Idea tags"
              namespace="apps.ideaBox"
              placeholder='Tag your idea with "awesome", "cool", etc.'
              setValue={setIdeaTags}
              value={ideaTags}
            />
          )}
        </QueryWrapper>
      </div>
      <Button
        className="mt-6 w-full"
        disabled={
          (innerTypeOfModifyIdea === 'text' &&
            ideaContent.trim().length === 0) ||
          (innerTypeOfModifyIdea === 'link' &&
            (ideaLink.trim().length === 0 ||
              !ideaLink.match(/^http(s)?:\/\/.+/)))
        }
        icon={
          !loading
            ? {
                create: 'tabler:plus',
                update: 'tabler:pencil',
                paste: 'tabler:plus'
              }[innerOpenType!]
            : 'svg-spinners:180-ring'
        }
        loading={loading}
        onClick={() => {
          onSubmitButtonClick().catch(console.error)
        }}
      >
        {!loading &&
          {
            create: 'CREATE',
            update: 'UPDATE',
            paste: 'CREATE'
          }[innerOpenType!]}
      </Button>
    </div>
  )
}

export default ModifyIdeaModal
