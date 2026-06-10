import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController
} from 'react-hook-form'

import { CurrencyInput, type CurrencyInputProps } from '@/components/inputs'

import { useNamespace } from '../FormModal'

type CurrencyFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPathByValue<TFieldValues, number | null | undefined>
} & Omit<CurrencyInputProps, 'value' | 'onChange'>

export function CurrencyField<TFieldValues extends FieldValues>({
  control,
  name,
  namespace,
  ...rest
}: CurrencyFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({
    control,
    name
  })
  
const contextNamespace = useNamespace()

  const activeNamespace = namespace ?? contextNamespace

  return (
    <CurrencyInput
      errorMsg={fieldState.error?.message}
      namespace={activeNamespace}
      value={field.value ?? 0}
      onChange={field.onChange}
      {...rest}
    />
  )
}
