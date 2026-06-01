import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController
} from 'react-hook-form'

import { IconInput, type IconInputProps } from '@/components/inputs'

type IconFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPathByValue<TFieldValues, string>
} & Omit<IconInputProps, 'value' | 'onChange'>

export function IconField<TFieldValues extends FieldValues>({
  control,
  name,
  ...rest
}: IconFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({
    control,
    name
  })

  return (
    <IconInput
      errorMsg={fieldState.error?.message}
      value={field.value ?? ''}
      onChange={field.onChange}
      {...rest}
    />
  )
}
