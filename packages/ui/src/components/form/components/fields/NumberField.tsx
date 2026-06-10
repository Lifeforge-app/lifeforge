import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController
} from 'react-hook-form'

import { NumberInput, type NumberInputProps } from '@/components/inputs'

import { useNamespace } from '../FormModal'

type NumberFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPathByValue<TFieldValues, number | null | undefined>
} & Omit<NumberInputProps, 'value' | 'onChange'>

export function NumberField<TFieldValues extends FieldValues>({
  control,
  name,
  namespace,
  ...rest
}: NumberFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({
    control,
    name
  })
  
const contextNamespace = useNamespace()

  const activeNamespace = namespace ?? contextNamespace

  return (
    <NumberInput
      errorMsg={fieldState.error?.message}
      namespace={activeNamespace}
      value={field.value ?? 0}
      onChange={field.onChange}
      {...rest}
    />
  )
}
