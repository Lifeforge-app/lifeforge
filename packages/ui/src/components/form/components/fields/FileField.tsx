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
  onChange?: (value: FileValue) => void
  onFileRemove?: () => void
  required?: boolean
  namespace?: string | false
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
  onChange,
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
      onChange={data => {
        field.onChange(data)
        onChange?.(data)
      }}
      {...rest}
    />
  )
}
