import { FileInput } from '@components/inputs'

import type { FileData } from '../../../../../../inputs/FileInput'
import type {
  BaseFieldProps,
  FormInputProps
} from '../../../typescript/form.types'

export type FileFieldProps<TOptional extends boolean = false> = BaseFieldProps<
  FileData,
  string | File
> & {
  type: 'file'
  icon: string
  optional: TOptional
  onFileRemoved?: () => void
  enablePixabay?: boolean
  enableUrl?: boolean
  enableAIImageGeneration?: boolean
  defaultImageGenerationPrompt?: string
  acceptedMimeTypes?: Record<string, string[]>
}

function FormFileInput({
  field,
  value,
  namespace,
  handleChange
}: FormInputProps<FileFieldProps>) {
  return (
    <FileInput
      acceptedMimeTypes={
        field.acceptedMimeTypes || {
          images: ['image/png', 'image/jpeg', 'image/webp']
        }
      }
      defaultAIPrompt={field.defaultImageGenerationPrompt}
      disabled={field.disabled}
      enableAI={field.enableAIImageGeneration}
      enablePixabay={field.enablePixabay}
      enableUrl={field.enableUrl}
      file={value.file}
      icon={field.icon}
      label={field.label}
      namespace={namespace}
      preview={value.preview}
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
