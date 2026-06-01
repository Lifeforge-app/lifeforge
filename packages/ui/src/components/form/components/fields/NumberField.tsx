import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController
} from 'react-hook-form'

import { NumberInput, type NumberInputProps } from '@/components/inputs'

type NumberFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPathByValue<TFieldValues, number>
} & Omit<NumberInputProps, 'value' | 'onChange'>

export function NumberField<TFieldValues extends FieldValues>({
  control,
  name,
  ...rest
}: NumberFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({
    control,
    name
  })

  return (
    <NumberInput
      errorMsg={fieldState.error?.message}
      value={field.value ?? 0}
      onChange={field.onChange}
      {...rest}
    />
  )
}
