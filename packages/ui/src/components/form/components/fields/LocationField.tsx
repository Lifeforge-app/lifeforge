import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController
} from 'react-hook-form'

import { type Location, LocationInput } from '@/components/inputs'

type LocationFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPathByValue<TFieldValues, Location | null>
  icon?: string
  label: string
  required?: boolean
  disabled?: boolean
  autoFocus?: boolean
  namespace?: string
}

export function LocationField<TFieldValues extends FieldValues>({
  control,
  name,
  disabled = false,
  required = false,
  autoFocus = false,
  ...rest
}: LocationFieldProps<TFieldValues>) {
  const { field } = useController({
    control,
    name
  })

  return (
    <LocationInput
      autoFocus={autoFocus}
      disabled={disabled}
      required={required}
      value={field.value ?? null}
      onChange={field.onChange}
      {...rest}
    />
  )
}
