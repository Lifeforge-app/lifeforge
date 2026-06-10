import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController
} from 'react-hook-form'

import { TextAreaInput, type TextAreaInputProps } from '@/components/inputs'

import { useNamespace } from '../FormModal'

type TextAreaFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPathByValue<TFieldValues, string | null | undefined>
} & Omit<TextAreaInputProps, 'value' | 'onChange'>

export function TextAreaField<TFieldValues extends FieldValues>({
  control,
  name,
  namespace,
  ...rest
}: TextAreaFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({
    control,
    name
  })

  const contextNamespace = useNamespace()

  const activeNamespace = namespace ?? contextNamespace

  return (
    <TextAreaInput
      errorMsg={fieldState.error?.message}
      namespace={activeNamespace}
      value={field.value ?? ''}
      onChange={field.onChange}
      {...rest}
    />
  )
}
