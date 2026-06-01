import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController
} from 'react-hook-form'

import { FileInput, type FilePickerSourceConfig, type FileValue } from '@/components/inputs'

type FileFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPathByValue<TFieldValues, FileValue>
  icon: string
  label: string
  reminderText?: string
  onImageRemoved?: () => void
  required?: boolean
  namespace?: string
  disabled?: boolean
  sources?: FilePickerSourceConfig
  mimeTypes?: Record<string, string[]>
}

export function FileField<TFieldValues extends FieldValues>({
  control,
  name,
  ...rest
}: FileFieldProps<TFieldValues>) {
  const { field } = useController({
    control,
    name
  })

  return (
    <FileInput
      value={field.value ?? { type: 'empty' }}
      onChange={field.onChange}
      {...rest}
    />
  )
}
