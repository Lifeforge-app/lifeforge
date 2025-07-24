import {
  DnDContainer,
  PreviewContainer,
  TextAreaInput,
  TextInput
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import { IdeaBoxCollectionsSchemas } from 'shared/types/collections'

function IdeaContentInput({
  formState,
  setFormState,
  innerOpenType,
  innerTypeOfModifyIdea,
  getInputProps,
  getRootProps,
  isDragActive,
  preview,
  setPreview,
  debouncedImageLink
}: {
  formState: {
    content: string
    image: File | string | null
    link: string
    title: string
    imageLink: string
    tags: string[]
  }
  innerOpenType: 'create' | 'update' | 'paste' | null
  innerTypeOfModifyIdea: IdeaBoxCollectionsSchemas.IEntry['type']
  getInputProps: () => Record<string, unknown>
  getRootProps: () => Record<string, unknown>
  isDragActive: boolean
  preview: string | ArrayBuffer | null
  setPreview: React.Dispatch<React.SetStateAction<string | ArrayBuffer | null>>
  setFormState: React.Dispatch<
    React.SetStateAction<{
      content: string
      image: File | string | null
      link: string
      title: string
      imageLink: string
      tags: string[]
    }>
  >
  debouncedImageLink: string
}) {
  const { t } = useTranslation('common.modals')

  if (innerTypeOfModifyIdea === 'text') {
    return (
      <TextAreaInput
        darker
        required
        icon="tabler:file-text"
        name="Idea Content"
        namespace="apps.ideaBox"
        placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, lorem euismod."
        setValue={value => setFormState(prev => ({ ...prev, content: value }))}
        value={formState.content}
      />
    )
  }

  if (innerTypeOfModifyIdea === 'link') {
    return (
      <>
        <TextInput
          darker
          icon="tabler:bulb"
          name="Idea title"
          namespace="apps.ideaBox"
          placeholder="Mind blowing idea"
          setValue={value => setFormState(prev => ({ ...prev, title: value }))}
          value={formState.title}
        />
        <TextInput
          darker
          required
          icon="tabler:link"
          name="Idea link"
          namespace="apps.ideaBox"
          placeholder="https://example.com"
          setValue={value => setFormState(prev => ({ ...prev, link: value }))}
          value={formState.link}
        />
      </>
    )
  }

  return (
    innerOpenType !== 'update' && (
      <>
        {preview ? (
          <>
            <PreviewContainer
              file={formState.image}
              fileName={debouncedImageLink.split.pop() ?? undefined}
              preview={preview as string}
              setFile={value =>
                setFormState(prev => ({ ...prev, image: value }))
              }
              setPreview={value => setPreview(value)}
              onRemove={() => {
                setFormState(prev => ({ ...prev, image: null }))
                setPreview(null)
              }}
            />
          </>
        ) : (
          <DnDContainer
            getInputProps={getInputProps}
            getRootProps={getRootProps}
            isDragActive={isDragActive}
            setFile={file => setFormState(prev => ({ ...prev, image: file }))}
            setPreview={
              setPreview as React.Dispatch<
                React.SetStateAction<string | ArrayBuffer | null>
              >
            }
          />
        )}
        {formState.image === null && (
          <>
            <div className="text-bg-500 mt-6 text-center font-medium tracking-widest uppercase">
              {t('imagePicker.orPasteLink')}
            </div>
            <TextInput
              darker
              icon="tabler:link"
              name="Image link"
              namespace="apps.ideaBox"
              placeholder="https://example.com/image.jpg"
              setValue={value =>
                setFormState(prev => ({ ...prev, imageLink: value }))
              }
              value={formState.imageLink}
            />
          </>
        )}
      </>
    )
  )
}

export default IdeaContentInput
