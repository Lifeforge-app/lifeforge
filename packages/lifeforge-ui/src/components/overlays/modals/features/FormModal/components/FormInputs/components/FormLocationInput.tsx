import { type Location, LocationInput } from '@components/inputs'

import type {
  BaseFieldProps,
  FormInputProps
} from '../../../typescript/form.types'

export type LocationFieldProps = BaseFieldProps<
  Location | null,
  Location,
  true
> & {
  type: 'location'
}

function FormLocationInput({
  field,
  value,
  autoFocus,
  namespace,
  handleChange
}: FormInputProps<LocationFieldProps>) {
  return (
    <LocationInput
      autoFocus={autoFocus}
      disabled={field.disabled}
      label={field.label}
      namespace={namespace}
      required={field.required}
      value={value}
      onChange={value => handleChange(value)}
    />
  )
}

export default FormLocationInput
