import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController
} from 'react-hook-form'

import { type Location, LocationInput } from '@/components/inputs'

import { useNamespace } from '../FormModal'

type LocationFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPathByValue<TFieldValues, Location | null | undefined>
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
  namespace,
  ...rest
}: LocationFieldProps<TFieldValues>) {
  const { field } = useController({
    control,
    name
  })

  const contextNamespace = useNamespace()
  const activeNamespace = namespace ?? contextNamespace

  return (
    <LocationInput
      autoFocus={autoFocus}
      disabled={disabled}
      required={required}
      namespace={activeNamespace}
      value={field.value ?? null}
      onChange={field.onChange}
      {...rest}
    />
  )
}
