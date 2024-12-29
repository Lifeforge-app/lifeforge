/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useDebounce } from '@uidotdev/usehooks'
import { t } from 'i18next'
import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import DnDContainer from '@components/ButtonsAndInputs/ImageAndFilePicker/ImagePickerModal/components/LocalUpload/components/DnDContainer'
import PreviewContainer from '@components/ButtonsAndInputs/ImageAndFilePicker/ImagePickerModal/components/LocalUpload/components/PreviewContainer'
import Input from '@components/ButtonsAndInputs/Input'
import ModalWrapper from '@components/Modals/ModalWrapper'
import { type IIdeaBoxEntry } from '@interfaces/ideabox_interfaces'
import APIRequest from '@utils/fetchData'
import IdeaContentInput from './components/IdeaContentInput'
import ModalHeader from './components/ModalHeader'

function ModifyIdeaModal({
  openType,
  setOpenType,
  typeOfModifyIdea,
  updateIdeaList,
  existedData,
  pastedData
}: {
  openType: 'create' | 'update' | 'paste' | null
  setOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | 'paste' | null>
  >
  typeOfModifyIdea: 'text' | 'image' | 'link'
  updateIdeaList: () => void
  existedData: IIdeaBoxEntry | null
  pastedData: {
    preview: string
    file: File
  } | null
}): React.ReactElement {
  const { id, '*': path } = useParams<{ id: string; '*': string }>()
  const innerOpenType = useDebounce(openType, openType === null ? 300 : 0)
  const [innerTypeOfModifyIdea, setInnerTypeOfModifyIdea] = useState<
    'text' | 'image' | 'link'
  >('text')
  const [ideaTitle, setIdeaTitle] = useState('')
  const [ideaContent, setIdeaContent] = useState('')
  const [ideaLink, setIdeaLink] = useState('')
  const [ideaImage, setIdeaImage] = useState<File | null>(null)
  const [imageLink, setImageLink] = useState<string>('')
  const debouncedImageLink = useDebounce(imageLink, 500)
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null)
  const [loading, setLoading] = useState(false)

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

  function updateIdeaContent(
    event: React.FormEvent<HTMLTextAreaElement>
  ): void {
    setIdeaContent(event.currentTarget.value)
  }

  function updateIdeaLink(event: React.ChangeEvent<HTMLInputElement>): void {
    setIdeaLink(event.target.value)
  }

  useEffect(() => {
    setInnerTypeOfModifyIdea(typeOfModifyIdea)
  }, [typeOfModifyIdea])

  useEffect(() => {
    if (innerOpenType === 'create') {
      setIdeaTitle('')
      setIdeaContent('')
      setIdeaLink('')
      setIdeaImage(null)
      setImageLink('')
      setPreview(null)
    } else if (innerOpenType === 'update') {
      if (existedData !== null) {
        setIdeaTitle(existedData.title)
        setIdeaContent(existedData.content)
        setIdeaLink(existedData.content)
        setIdeaImage(null)
        setPreview(null)
      }
    } else if (innerOpenType === 'paste' && pastedData !== null) {
      setIdeaTitle(pastedData.file.name)
      setIdeaContent('')
      setIdeaLink('')
      setIdeaImage(pastedData.file)
      setPreview(pastedData.preview)
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

  async function onSubmitButtonClick(): Promise<void> {
    switch (innerTypeOfModifyIdea) {
      case 'text':
        if (ideaContent.trim().length === 0) {
          toast.error('Idea content cannot be empty.')
          return
        }
        break
      case 'image':
        if (ideaImage === null && debouncedImageLink.trim().length === 0) {
          toast.error('Idea image cannot be empty.')
          return
        }
        break
      case 'link':
        if (ideaTitle.trim().length === 0 || ideaLink.trim().length === 0) {
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

    await APIRequest({
      endpoint: `idea-box/ideas/${
        innerOpenType === 'update' ? existedData?.id : ''
      }`,
      method: innerOpenType === 'update' ? 'PATCH' : 'POST',
      body:
        innerOpenType === 'update'
          ? {
              title: ideaTitle.trim(),
              content: ideaContent.trim(),
              link: ideaLink.trim(),
              type: innerTypeOfModifyIdea
            }
          : formData,
      finalCallback: () => {
        setLoading(false)
      },
      successInfo: innerOpenType,
      failureInfo: innerOpenType,
      callback: () => {
        updateIdeaList()
        setOpenType(null)
      },
      isJSON: innerOpenType === 'update'
    })
  }

  function onPasteImage(event: ClipboardEvent): void {
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
    <ModalWrapper isOpen={openType !== null} minWidth="60vw">
      <ModalHeader
        innerOpenType={
          innerOpenType !== null
            ? innerOpenType === 'update'
              ? 'update'
              : 'create'
            : null
        }
        setOpenType={setOpenType}
        innerTypeOfModifyIdea={innerTypeOfModifyIdea}
        setInnerTypeOfModifyIdea={setInnerTypeOfModifyIdea}
      />
      {innerTypeOfModifyIdea === 'link' && (
        <Input
          name="Idea title"
          icon="tabler:bulb"
          value={ideaTitle}
          updateValue={setIdeaTitle}
          darker
          placeholder="Mind blowing idea"
          className="mb-6"
        />
      )}
      {innerTypeOfModifyIdea !== 'image' ? (
        <IdeaContentInput
          innerTypeOfModifyIdea={innerTypeOfModifyIdea}
          ideaContent={ideaContent}
          ideaLink={ideaLink}
          updateIdeaContent={updateIdeaContent}
          updateIdeaLink={updateIdeaLink}
        />
      ) : (
        <>
          {preview ? (
            <>
              <PreviewContainer
                file={ideaImage}
                preview={preview as string}
                setFile={setIdeaImage}
                setPreview={setPreview}
                fileName={debouncedImageLink.split('/').pop() ?? undefined}
                onRemove={() => {
                  setImageLink('')
                }}
              />
            </>
          ) : (
            <DnDContainer
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              isDragActive={isDragActive}
            />
          )}
          {ideaImage === null && (
            <>
              <div className="mt-6 text-center font-medium uppercase tracking-widest text-bg-500">
                {t('imageUpload.orPasteLink')}
              </div>
              <Input
                icon="tabler:link"
                name="Image link"
                placeholder="https://example.com/image.jpg"
                value={imageLink}
                updateValue={setImageLink}
                className="mt-6"
                darker
              />
            </>
          )}
        </>
      )}
      <Button
        className="mt-6"
        loading={loading}
        onClick={() => {
          onSubmitButtonClick().catch(console.error)
        }}
        icon={
          !loading
            ? {
                create: 'tabler:plus',
                update: 'tabler:pencil',
                paste: 'tabler:plus'
              }[innerOpenType!]
            : 'svg-spinners:180-ring'
        }
      >
        {!loading &&
          {
            create: 'CREATE',
            update: 'UPDATE',
            paste: 'CREATE'
          }[innerOpenType!]}
      </Button>
    </ModalWrapper>
  )
}

export default ModifyIdeaModal
