import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController
} from 'react-hook-form'

import { SliderInput, type SliderInputProps } from '@/components/inputs'

import { useNamespace } from '../FormModal'

type SliderFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPathByValue<TFieldValues, number | null | undefined>
  namespace?: string
} & Omit<SliderInputProps, 'value' | 'onChange'>

export function SliderField<TFieldValues extends FieldValues>({
  control,
  name,
  namespace,
  ...rest
}: SliderFieldProps<TFieldValues>) {
  const { field } = useController({
    control,
    name
  })

  const contextNamespace = useNamespace()

  const activeNamespace = namespace ?? contextNamespace

  return (
    <SliderInput
      namespace={activeNamespace}
      value={field.value ?? 0}
      onChange={field.onChange}
      {...rest}
    />
  )
}
