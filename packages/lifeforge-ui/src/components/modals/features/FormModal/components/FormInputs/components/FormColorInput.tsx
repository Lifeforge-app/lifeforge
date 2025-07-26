import { ColorInput } from '@components/inputs'
import {
  type ColorFieldProps,
  type FormInputProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'

function FormColorInput({
  field,
  selectedData,
  namespace,
  handleChange
}: FormInputProps<ColorFieldProps>) {
  return (
    <ColorInput
      color={selectedData}
      disabled={field.disabled}
      name={field.label}
      namespace={namespace}
      required={field.required}
      setColor={handleChange}
    />
  )
}

export default FormColorInput
