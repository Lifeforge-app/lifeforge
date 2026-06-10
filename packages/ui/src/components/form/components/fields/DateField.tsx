import dayjs from 'dayjs'
import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController
} from 'react-hook-form'

import { DateInput, type DateInputProps } from '@/components/inputs'

import { useNamespace } from '../FormModal'

type DateFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPathByValue<TFieldValues, Date | null | string | undefined>
} & Omit<DateInputProps, 'value' | 'onChange'>

export function DateField<TFieldValues extends FieldValues>({
  control,
  name,
  namespace,
  ...rest
}: DateFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({
    control,
    name
  })
  
const contextNamespace = useNamespace()

  const activeNamespace = namespace ?? contextNamespace

  const val = field.value as unknown

  const dateValue = val
    ? val instanceof Date
      ? val
      : dayjs(val as string).toDate()
    : null

  return (
    <DateInput
      errorMsg={fieldState.error?.message}
      namespace={activeNamespace}
      value={dateValue}
      onChange={field.onChange}
      {...rest}
    />
  )
}
