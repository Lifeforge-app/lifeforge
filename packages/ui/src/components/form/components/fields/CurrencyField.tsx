import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController
} from 'react-hook-form'

import { CurrencyInput, type CurrencyInputProps } from '@/components/inputs'

type CurrencyFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPathByValue<TFieldValues, number>
} & Omit<CurrencyInputProps, 'value' | 'onChange'>

export function CurrencyField<TFieldValues extends FieldValues>({
  control,
  name,
  ...rest
}: CurrencyFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({
    control,
    name
  })

  return (
    <CurrencyInput
      errorMsg={fieldState.error?.message}
      value={field.value ?? 0}
      onChange={field.onChange}
      {...rest}
    />
  )
}
