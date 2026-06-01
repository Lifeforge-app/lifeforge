import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController
} from 'react-hook-form'

import { SliderInput, type SliderInputProps } from '@/components/inputs'

type SliderFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPathByValue<TFieldValues, number>
} & Omit<SliderInputProps, 'value' | 'onChange'>

export function SliderField<TFieldValues extends FieldValues>({
  control,
  name,
  ...rest
}: SliderFieldProps<TFieldValues>) {
  const { field } = useController({
    control,
    name
  })

  return (
    <SliderInput
      value={field.value ?? 0}
      onChange={field.onChange}
      {...rest}
    />
  )
}
