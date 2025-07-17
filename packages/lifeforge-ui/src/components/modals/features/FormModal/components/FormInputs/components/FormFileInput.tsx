import {
  IFieldProps,
  IImageAndFileInputFieldProps
} from '@interfaces/modal_interfaces'

import { ImageAndFileInput } from '@components/inputs'

interface FormFileInputProps<T> {
  field: IFieldProps<T> & IImageAndFileInputFieldProps
  selectedData: {
    image: string | File | null
    preview: string | null
  }
  namespace: string
  handleChange: (value: {
    image: string | File | null
    preview: string | null
  }) => void
}

function FormFileInput<T>({
  field,
  selectedData,
  namespace,
  handleChange
}: FormFileInputProps<T>) {
  return (
    <ImageAndFileInput
      enablePixabay
      enableUrl
      acceptedMimeTypes={{
        images: ['image/png', 'image/jpeg', 'image/webp']
      }}
      defaultAIPrompt={field.defaultImageGenerationPrompt}
      disabled={field.disabled}
      enableAI={field.enableAIImageGeneration}
      icon="tabler:file"
      image={selectedData.image}
      name={field.label}
      namespace={namespace}
      preview={selectedData.preview}
      required={field.required}
      setData={handleChange}
      onImageRemoved={() =>
        handleChange({
          image: null,
          preview: null
        })
      }
    />
  )
}

export default FormFileInput
