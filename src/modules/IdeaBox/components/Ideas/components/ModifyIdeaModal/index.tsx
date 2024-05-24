/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import Input from '@components/ButtonsAndInputs/Input'
import Modal from '@components/Modals/Modal'
import { type IIdeaBoxEntry } from '@typedec/IdeaBox'
import IdeaContentInput from './components/IdeaContentInput'
import IdeaImagePreview from './components/IdeaImagePreview'
import IdeaImageUpload from './components/IdeaImageUpload'
import ModalHeader from './components/ModalHeader'
import APIRequest from '../../../../../../utils/fetchData'

function ModifyIdeaModal({
  openType,
  setOpenType,
  typeOfModifyIdea,
  containerId,
  updateIdeaList,
  existedData
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  typeOfModifyIdea: 'text' | 'image' | 'link'
  containerId: string
  updateIdeaList: () => void
  existedData: IIdeaBoxEntry | null
}): React.ReactElement {
  const { folderId } = useParams<{ folderId: string }>()
  const innerOpenType = useDebounce(openType, openType === null ? 300 : 0)
  const [innerTypeOfModifyIdea, setInnerTypeOfModifyIdea] = useState<
    'text' | 'image' | 'link'
  >('text')
  const [ideaTitle, setIdeaTitle] = useState('')
  const [ideaContent, setIdeaContent] = useState('')
  const [ideaLink, setIdeaLink] = useState('')
  const [ideaImage, setIdeaImage] = useState<File | null>(null)
  const [imageLink, setImageLink] = useState<string>('')
  const debouncedImageLink = useDebounce(imageLink, imageLink === '' ? 300 : 0)
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

  function updateIdeaTitle(event: React.ChangeEvent<HTMLInputElement>): void {
    setIdeaTitle(event.target.value)
  }

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
    if (openType === 'create') {
      setIdeaTitle('')
      setIdeaContent('')
      setIdeaLink('')
      setIdeaImage(null)
      setImageLink('')
    } else if (openType === 'update') {
      if (existedData !== null) {
        setIdeaTitle(existedData.title)
        setIdeaContent(existedData.content)
        setIdeaLink(existedData.content)
        setIdeaImage(null)
        setPreview(null)
      }
    }
  }, [openType, existedData])

  useEffect(() => {
    if (innerTypeOfModifyIdea === 'image' && debouncedImageLink !== '') {
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
  })

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
    formData.append('title', ideaTitle.trim())
    formData.append('content', ideaContent.trim())
    formData.append('link', ideaLink.trim())
    formData.append('image', ideaImage!)
    formData.append('imageLink', debouncedImageLink)
    formData.append('type', innerTypeOfModifyIdea)

    if (folderId !== undefined) {
      formData.append('folder', folderId)
    }

    await APIRequest({
      endpoint: `idea-box/idea/${
        innerOpenType === 'create' ? 'create' : 'update'
      }/${innerOpenType === 'create' ? containerId : existedData?.id}`,
      method: innerOpenType === 'create' ? 'POST' : 'PATCH',
      body:
        innerOpenType === 'create'
          ? formData
          : JSON.stringify({
              title: ideaTitle.trim(),
              content: ideaContent.trim(),
              link: ideaLink.trim(),
              type: innerTypeOfModifyIdea
            }),
      finalCallback: () => {
        setLoading(false)
      },
      successInfo: `Yay! Idea ${
        innerOpenType === 'create' ? 'created' : 'updated'
      } successfully.`,
      failureInfo: `Oops! Couldn't ${
        innerOpenType === 'create' ? 'create' : 'update'
      } the idea. Please try again.`,
      callback: () => {
        updateIdeaList()
        setOpenType(null)
      },
      isJSON: innerOpenType === 'update'
    })
  }

  return (
    <Modal isOpen={openType !== null}>
      <ModalHeader
        innerOpenType={innerOpenType}
        setOpenType={setOpenType}
        innerTypeOfModifyIdea={innerTypeOfModifyIdea}
        setInnerTypeOfModifyIdea={setInnerTypeOfModifyIdea}
      />
      {innerTypeOfModifyIdea === 'link' && (
        <Input
          name="Idea title"
          icon="tabler:bulb"
          value={ideaTitle}
          updateValue={updateIdeaTitle}
          darker
          placeholder="Mind blowing idea"
          additionalClassName="mb-6"
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
            <IdeaImagePreview preview={preview} setPreview={setPreview} />
          ) : (
            <IdeaImageUpload
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              isDragActive={isDragActive}
            />
          )}
          <div className="mt-6 text-center font-medium uppercase tracking-widest text-bg-500">
            or paste the link to the image
          </div>
          <Input
            icon="tabler:link"
            name="Image link"
            placeholder="https://example.com/image.jpg"
            value={imageLink}
            updateValue={e => {
              setImageLink(e.target.value)
            }}
            additionalClassName="mt-6"
          />
        </>
      )}
      <Button
        className="mt-6"
        disabled={loading}
        onClick={() => {
          onSubmitButtonClick().catch(console.error)
        }}
        icon={
          !loading
            ? {
                create: 'tabler:plus',
                update: 'tabler:pencil'
              }[innerOpenType!]
            : 'svg-spinners:180-ring'
        }
      >
        {!loading &&
          {
            create: 'CREATE',
            update: 'UPDATE'
          }[innerOpenType!]}
      </Button>
    </Modal>
  )
}

export default ModifyIdeaModal
