import { FileInput } from '@components/inputs'
import {
  IFileInputFieldProps,
  InferFormInputProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'

function FormFileInput({
  field,
  selectedData,
  namespace,
  handleChange
}: InferFormInputProps<IFileInputFieldProps>) {
  return (
    <FileInput
      enablePixabay
      enableUrl
      acceptedMimeTypes={{
        images: ['image/png', 'image/jpeg', 'image/webp']
      }}
      defaultAIPrompt={field.defaultImageGenerationPrompt}
      disabled={field.disabled}
      enableAI={field.enableAIImageGeneration}
      icon="tabler:file"
      image={selectedData.file}
      name={field.label}
      namespace={namespace}
      preview={selectedData.preview}
      required={field.required}
      setData={handleChange}
      onImageRemoved={() =>
        handleChange({
          file: null,
          preview: null
        })
      }
    />
  )
}

export default FormFileInput
