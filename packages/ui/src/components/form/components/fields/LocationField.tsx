import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController
} from 'react-hook-form'

import {
  type Location,
  LocationInput,
  type LocationInputProps
} from '@/components/inputs'

import { useNamespace } from '../FormModal'

type LocationFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPathByValue<TFieldValues, Location | null | undefined>
} & Omit<LocationInputProps, 'value' | 'onChange'>

export function LocationField<TFieldValues extends FieldValues>({
  control,
  name,
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
      errorMsg={fieldState.error?.message}
      namespace={activeNamespace}
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
