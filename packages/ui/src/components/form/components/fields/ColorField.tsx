import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController
} from 'react-hook-form'

import { ColorInput, type ColorInputProps } from '@/components/inputs'

type ColorFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPathByValue<TFieldValues, string>
} & Omit<ColorInputProps, 'value' | 'onChange'>

export function ColorField<TFieldValues extends FieldValues>({
  control,
  name,
  ...rest
}: ColorFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({
    control,
    name
  })

  return (
    <ColorInput
      errorMsg={fieldState.error?.message}
      value={field.value ?? ''}
      onChange={field.onChange}
      {...rest}
    />
  )
}
