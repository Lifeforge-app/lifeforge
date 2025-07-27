import { FileInput } from '@components/inputs'
import {
  type FileFieldProps,
  type FormInputProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'

function FormFileInput({
  field,
  selectedData,
  namespace,
  handleChange
}: FormInputProps<FileFieldProps>) {
  return (
    <FileInput
      acceptedMimeTypes={{
        images: ['image/png', 'image/jpeg', 'image/webp']
      }}
      defaultAIPrompt={field.defaultImageGenerationPrompt}
      disabled={field.disabled}
      enableAI={field.enableAIImageGeneration}
      enablePixabay={field.enablePixabay}
      enableUrl={field.enableUrl}
      file={selectedData.file}
      icon={field.icon}
      name={field.label}
      namespace={namespace}
      preview={selectedData.preview}
      required={field.required}
      setData={handleChange}
      onImageRemoved={() => {
        handleChange({
          file: 'removed',
          preview: null
        })
      }}
    />
  )
}

export default FormFileInput
