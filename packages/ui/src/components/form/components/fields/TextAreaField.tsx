import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController
} from 'react-hook-form'

import { TextAreaInput, type TextAreaInputProps } from '@/components/inputs'

type TextAreaFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPathByValue<TFieldValues, string>
} & Omit<TextAreaInputProps, 'value' | 'onChange'>

export function TextAreaField<TFieldValues extends FieldValues>({
  control,
  name,
  ...rest
}: TextAreaFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({
    control,
    name
  })

  return (
    <TextAreaInput
      errorMsg={fieldState.error?.message}
      value={field.value ?? ''}
      onChange={field.onChange}
      {...rest}
    />
  )
}
