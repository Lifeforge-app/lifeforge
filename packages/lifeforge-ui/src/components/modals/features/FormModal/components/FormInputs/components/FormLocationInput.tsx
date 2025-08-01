import { LocationInput } from '@components/inputs'
import {
  type FormInputProps,
  type LocationFieldProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'

function FormLocationInput({
  field,
  selectedData,
  namespace,
  handleChange
}: FormInputProps<LocationFieldProps>) {
  return (
    <LocationInput
      disabled={field.disabled}
      label={field.label}
      location={selectedData}
      namespace={namespace}
      required={field.required}
      setLocation={value => handleChange(value)}
    />
  )
}

export default FormLocationInput
