import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController
} from 'react-hook-form'

import { ColorInput, type ColorInputProps } from '@/components/inputs'

import { useNamespace } from '../FormModal'

type ColorFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPathByValue<TFieldValues, string | null | undefined>
} & Omit<ColorInputProps, 'value' | 'onChange'>

export function ColorField<TFieldValues extends FieldValues>({
  control,
  name,
  namespace,
  ...rest
}: ColorFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({
    control,
    name
  })
  
const contextNamespace = useNamespace()

  const activeNamespace = namespace ?? contextNamespace

  return (
    <ColorInput
      errorMsg={fieldState.error?.message}
      namespace={activeNamespace}
      value={field.value ?? ''}
      onChange={field.onChange}
      {...rest}
    />
  )
}
