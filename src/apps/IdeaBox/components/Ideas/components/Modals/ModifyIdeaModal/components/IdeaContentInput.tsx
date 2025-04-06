import { useTranslation } from 'react-i18next'

import {
  DnDContainer,
  PreviewContainer,
  TextAreaInput,
  TextInput
} from '@lifeforge/ui'

import { IIdeaBoxEntry } from '@apps/IdeaBox/interfaces/ideabox_interfaces'

function IdeaContentInput({
  ideaContent,
  ideaImage,
  ideaLink,
  ideaTitle,
  imageLink,
  innerOpenType,
  innerTypeOfModifyIdea,
  getInputProps,
  getRootProps,
  isDragActive,
  preview,
  setIdeaImage,
  setImageLink,
  setIdeaContent,
  setIdeaLink,
  setPreview,
  setIdeaTitle,
  debouncedImageLink
}: {
  ideaContent: string
  ideaImage: File | null
  ideaLink: string
  ideaTitle: string
  imageLink: string
  innerOpenType: 'create' | 'update' | 'paste' | null
  innerTypeOfModifyIdea: IIdeaBoxEntry['type']
  getInputProps: () => Record<string, unknown>
  getRootProps: () => Record<string, unknown>
  isDragActive: boolean
  preview: string | ArrayBuffer | null
  setIdeaContent: React.Dispatch<React.SetStateAction<string>>
  setIdeaImage: React.Dispatch<React.SetStateAction<File | null>>
  setIdeaLink: React.Dispatch<React.SetStateAction<string>>
  setImageLink: React.Dispatch<React.SetStateAction<string>>
  setPreview: React.Dispatch<React.SetStateAction<string | null | ArrayBuffer>>
  setIdeaTitle: React.Dispatch<React.SetStateAction<string>>
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
        setValue={setIdeaContent}
        value={ideaContent}
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
          setValue={setIdeaTitle}
          value={ideaTitle}
        />
        <TextInput
          darker
          required
          icon="tabler:link"
          name="Idea link"
          namespace="apps.ideaBox"
          placeholder="https://example.com"
          setValue={setIdeaLink}
          value={ideaLink}
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
              file={ideaImage}
              fileName={debouncedImageLink.split('/').pop() ?? undefined}
              preview={preview as string}
              setFile={setIdeaImage}
              setPreview={setPreview}
              onRemove={() => {
                setImageLink('')
              }}
            />
          </>
        ) : (
          <DnDContainer
            getInputProps={getInputProps}
            getRootProps={getRootProps}
            isDragActive={isDragActive}
            setFile={
              setIdeaImage as React.Dispatch<
                React.SetStateAction<File | string | null>
              >
            }
            setPreview={
              setPreview as React.Dispatch<
                React.SetStateAction<string | ArrayBuffer | null>
              >
            }
          />
        )}
        {ideaImage === null && (
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
              setValue={setImageLink}
              value={imageLink}
            />
          </>
        )}
      </>
    )
  )
}

export default IdeaContentInput
