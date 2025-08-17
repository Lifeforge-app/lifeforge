import { LocationInput } from '@components/inputs'
import {
  type FormInputProps,
  type LocationFieldProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'

function FormLocationInput({
  field,
  value,
  namespace,
  handleChange
}: FormInputProps<LocationFieldProps>) {
  return (
    <LocationInput
      disabled={field.disabled}
      label={field.label}
      namespace={namespace}
      required={field.required}
      setValue={value => handleChange(value)}
      value={value}
    />
  )
}

export default FormLocationInput
