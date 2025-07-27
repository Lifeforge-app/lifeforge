import { useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { Button, QueryWrapper, TagsInput } from 'lifeforge-ui'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import { fetchAPI } from 'shared'

import {
  type IdeaBoxIdea,
  useIdeaBoxContext
} from '@apps/IdeaBox/providers/IdeaBoxProvider'

import IdeaContentInput from './components/IdeaContentInput'
import ModalHeader from './components/ModalHeader'

function ModifyIdeaModal({
  data: { type, ideaType, initialData, pastedData },
  onClose
}: {
  data: {
    type: 'create' | 'update' | 'paste'
    ideaType: IdeaBoxIdea['type']
    initialData?: IdeaBoxIdea
    pastedData?: { file: File; preview: string }
  }
  onClose: () => void
}) {
  const { tagsQuery } = useIdeaBoxContext()

  const { id, '*': path } = useParams<{ id: string; '*': string }>()

  const innerOpenType = useDebounce(type, type === null ? 300 : 0)

  const [innerTypeOfModifyIdea, setInnerTypeOfModifyIdea] =
    useState<IdeaBoxIdea['type']>('text')

  const [formState, setFormState] = useState<{
    title: string
    content: string
    link: string
    image: File | string | null
    imageLink: string
    tags: string[]
  }>({
    title: '',
    content: '',
    link: '',
    image: null,
    imageLink: '',
    tags: []
  })

  const debouncedImageLink = useDebounce(formState.imageLink, 300)

  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null)

  const [loading, setLoading] = useState(false)

  const queryClient = useQueryClient()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = new FileReader()

    file.onload = function () {
      setPreview(file.result)
    }

    file.readAsDataURL(acceptedFiles[0])
    setFormState(prev => ({
      ...prev,
      ideaImage: acceptedFiles[0]
    }))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop
  })

  useEffect(() => {
    setInnerTypeOfModifyIdea(ideaType)
  }, [ideaType])

  useEffect(() => {
    if (innerOpenType === 'create') {
      setFormState({
        title: '',
        content: '',
        link: '',
        image: null,
        imageLink: '',
        tags: []
      })
    } else if (innerOpenType === 'update') {
      if (initialData) {
        setFormState({
          title: initialData.title,
          content: initialData.content,
          link: initialData.content,
          image: null,
          imageLink: '',
          tags: initialData.tags ?? []
        })
        setPreview(null)
      }
    } else if (innerOpenType === 'paste' && pastedData) {
      setFormState({
        title: '',
        content: '',
        link: '',
        image: pastedData.file,
        imageLink: '',
        tags: []
      })
      setPreview(pastedData.preview)
    }
  }, [initialData, innerOpenType])

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
        if (formState.content.trim().length === 0) {
          toast.error('Idea content cannot be empty.')

          return
        }
        break
      case 'image':
        if (
          innerOpenType === 'create' &&
          formState.image === null &&
          debouncedImageLink.trim().length === 0
        ) {
          toast.error('Idea image cannot be empty.')

          return
        }
        break
      case 'link':
        if (formState.link.trim().length === 0) {
          toast.error('Idea title and link cannot be empty.')

          return
        }
        break
    }

    setLoading(true)

    const formData = new FormData()

    formData.append('container', id ?? '')
    formData.append('title', formState.title.trim())
    formData.append(
      'content',
      innerTypeOfModifyIdea === 'text'
        ? formState.content.trim()
        : formState.link.trim()
    )
    formData.append('image', formState.image!)
    formData.append('imageLink', debouncedImageLink)
    formData.append('type', innerTypeOfModifyIdea)
    formData.append('folder', path?.split.pop() ?? '')
    formData.append('tags', JSON.stringify(formState.tags))

    try {
      await fetchAPI(
        import.meta.env.VITE_API_HOST,
        `idea-box/ideas/${innerOpenType === 'update' ? initialData?.id || '' : ''}`,
        {
          method: innerOpenType === 'update' ? 'PATCH' : 'POST',
          body:
            innerOpenType === 'update'
              ? ({
                  title: formState.title.trim(),
                  content:
                    innerTypeOfModifyIdea === 'text'
                      ? formState.content.trim()
                      : formState.link.trim(),
                  type: innerTypeOfModifyIdea,
                  tags: formState.tags
                } satisfies IdeaBoxControllersSchemas.IIdeas['updateIdea']['body'])
              : formData
        }
      )

      queryClient.invalidateQueries({
        queryKey: ['idea-box', 'ideas', id, path]
      })

      queryClient.invalidateQueries({
        queryKey: ['idea-box', 'search', id, path]
      })

      queryClient.invalidateQueries({ queryKey: ['idea-box', 'tags'] })
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
      setFormState(prev => ({
        ...prev,
        image: file
      }))
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
          formState={formState}
          getInputProps={getInputProps}
          getRootProps={getRootProps}
          innerOpenType={innerOpenType}
          innerTypeOfModifyIdea={innerTypeOfModifyIdea}
          isDragActive={isDragActive}
          preview={preview}
          setFormState={setFormState}
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
              setValue={value =>
                setFormState(prev => ({ ...prev, tags: value }))
              }
              value={formState.tags}
            />
          )}
        </QueryWrapper>
      </div>
      <Button
        className="mt-6 w-full"
        disabled={
          (innerTypeOfModifyIdea === 'text' &&
            formState.content.trim().length === 0) ||
          (innerTypeOfModifyIdea === 'link' &&
            (formState.link.trim().length === 0 ||
              !formState.link.match(/^http(s)?:\/\/.+/)))
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
