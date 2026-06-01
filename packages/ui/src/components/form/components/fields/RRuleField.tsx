import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController
} from 'react-hook-form'

import { RRuleInput } from '@/components/inputs'

type RRuleFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPathByValue<TFieldValues, string | null | undefined>
  hasDuration?: boolean
}

export function RRuleField<TFieldValues extends FieldValues>({
  control,
  name,
  hasDuration = false,
  ...rest
}: RRuleFieldProps<TFieldValues>) {
  const { field } = useController({
    control,
    name
  })

  return (
    <RRuleInput
      hasDuration={hasDuration}
      value={field.value ?? ''}
      onChange={field.onChange}
      {...rest}
    />
  )
}
