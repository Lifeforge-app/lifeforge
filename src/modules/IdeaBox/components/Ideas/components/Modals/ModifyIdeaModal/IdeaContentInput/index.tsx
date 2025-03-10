import React from 'react'
import { useTranslation } from 'react-i18next'
import { TextInput, TagsInput } from '@components/inputs'
import DnDContainer from '@components/inputs/ImageAndFileInput/ImagePickerModal/components/LocalUpload/components/DnDContainer'
import PreviewContainer from '@components/inputs/ImageAndFileInput/ImagePickerModal/components/LocalUpload/components/PreviewContainer'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import { useIdeaBoxContext } from '@providers/IdeaBoxProvider'
import TextContentInput from './components/TextContentInput'

function IdeaContentInput({
  ideaContent,
  ideaImage,
  ideaLink,
  ideaTags,
  ideaTitle,
  imageLink,
  innerOpenType,
  innerTypeOfModifyIdea,
  getInputProps,
  getRootProps,
  isDragActive,
  preview,
  setIdeaImage,
  setIdeaTags,
  setImageLink,
  setPreview,
  setIdeaTitle,
  updateIdeaContent,
  updateIdeaLink,
  debouncedImageLink
}: {
  ideaContent: string
  ideaImage: File | null
  ideaLink: string
  ideaTags: string[]
  ideaTitle: string
  imageLink: string
  innerOpenType: 'create' | 'update' | 'paste' | null
  innerTypeOfModifyIdea: 'text' | 'image' | 'link'
  getInputProps: () => Record<string, unknown>
  getRootProps: () => Record<string, unknown>
  isDragActive: boolean
  preview: string | ArrayBuffer | null
  setIdeaContent: React.Dispatch<React.SetStateAction<string>>
  setIdeaImage: React.Dispatch<React.SetStateAction<File | null>>
  setIdeaLink: React.Dispatch<React.SetStateAction<string>>
  setIdeaTags: React.Dispatch<React.SetStateAction<string[]>>
  setImageLink: React.Dispatch<React.SetStateAction<string>>
  setPreview: React.Dispatch<React.SetStateAction<string | null | ArrayBuffer>>
  setIdeaTitle: React.Dispatch<React.SetStateAction<string>>
  updateIdeaContent: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  updateIdeaLink: (e: React.ChangeEvent<HTMLInputElement>) => void
  debouncedImageLink: string
}): React.ReactElement {
  const { t } = useTranslation('modules.ideaBox')
  const { tags } = useIdeaBoxContext()

  return (
    <div className="space-y-4">
      {innerTypeOfModifyIdea !== 'text' && (
        <TextInput
          darker
          icon="tabler:bulb"
          name="Idea title"
          namespace="modules.ideaBox"
          placeholder="Mind blowing idea"
          setValue={setIdeaTitle}
          value={ideaTitle}
        />
      )}
      {innerTypeOfModifyIdea !== 'image' ? (
        <TextContentInput
          ideaContent={ideaContent}
          ideaLink={ideaLink}
          innerTypeOfModifyIdea={innerTypeOfModifyIdea}
          updateIdeaContent={updateIdeaContent}
          updateIdeaLink={updateIdeaLink}
        />
      ) : (
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
              />
            )}
            {ideaImage === null && (
              <>
                <div className="text-bg-500 mt-6 text-center font-medium tracking-widest uppercase">
                  {t('imageUpload.orPasteLink')}
                </div>
                <TextInput
                  darker
                  icon="tabler:link"
                  name="Image link"
                  namespace="modules.ideaBox"
                  placeholder="https://example.com/image.jpg"
                  setValue={setImageLink}
                  value={imageLink}
                />
              </>
            )}
          </>
        )
      )}
      <APIFallbackComponent data={tags}>
        {tags => (
          <TagsInput
            darker
            className="mt-6"
            existedTags={tags}
            icon="tabler:tag"
            name="Idea tags"
            namespace="modules.ideaBox"
            placeholder='Tag your idea with "awesome", "cool", etc.'
            setValue={setIdeaTags}
            value={ideaTags}
          />
        )}
      </APIFallbackComponent>
    </div>
  )
}

export default IdeaContentInput
