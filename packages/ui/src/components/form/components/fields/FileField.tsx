import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController
} from 'react-hook-form'

import {
  FileInput,
  type FilePickerSourceConfig,
  type FileValue
} from '@/components/inputs'

import { useNamespace } from '../FormModal'

type FileFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPathByValue<TFieldValues, FileValue | null | undefined>
  icon: string
  label: string
  reminderText?: string
  onImageRemoved?: () => void
  required?: boolean
  namespace?: string
  disabled?: boolean
  sources?: FilePickerSourceConfig
  mimeTypes?: Record<string, string[]>
  errorMsg?: string
}

export function FileField<TFieldValues extends FieldValues>({
  control,
  name,
  namespace,
  errorMsg,
  ...rest
}: FileFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({
    control,
    name
  })

  const contextNamespace = useNamespace()

  const activeNamespace = namespace ?? contextNamespace

  return (
    <FileInput
      errorMsg={errorMsg ?? fieldState.error?.message}
      namespace={activeNamespace}
      value={field.value ?? { type: 'empty' }}
      onChange={field.onChange}
      {...rest}
    />
  )
}
