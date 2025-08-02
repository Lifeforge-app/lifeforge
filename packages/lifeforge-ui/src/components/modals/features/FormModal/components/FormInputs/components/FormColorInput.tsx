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
      value={selectedData}
      disabled={field.disabled}
      label={field.label}
      namespace={namespace}
      required={field.required}
      setValue={handleChange}
    />
  )
}

export default FormColorInput
