import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController
} from 'react-hook-form'

import { IconInput, type IconInputProps } from '@/components/inputs'

import { useNamespace } from '../FormModal'

type IconFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPathByValue<TFieldValues, string | null | undefined>
} & Omit<IconInputProps, 'value' | 'onChange'>

export function IconField<TFieldValues extends FieldValues>({
  control,
  name,
  namespace,
  ...rest
}: IconFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({
    control,
    name
  })
  const contextNamespace = useNamespace()

  const activeNamespace = namespace ?? contextNamespace

  return (
    <IconInput
      errorMsg={fieldState.error?.message}
      namespace={activeNamespace}
      value={field.value ?? ''}
      onChange={field.onChange}
      {...rest}
    />
  )
}
