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
  const { field, fieldState } = useController({
    control,
    name
  })
  const contextNamespace = useNamespace()

  const activeNamespace = namespace ?? contextNamespace

  return (
    <LocationInput
      autoFocus={autoFocus}
      disabled={disabled}
      errorMsg={fieldState.error?.message}
      namespace={activeNamespace}
      required={required}
      value={field.value}
      onChange={val =>
        field.onChange(
          val ?? {
            name: '',
            formattedAddress: '',
            location: {
              latitude: 0,
              longitude: 0
            }
          }
        )
      }
      {...rest}
    />
  )
}
