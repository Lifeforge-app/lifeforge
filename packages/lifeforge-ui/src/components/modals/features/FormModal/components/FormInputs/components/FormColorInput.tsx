import { ColorInput } from '@components/inputs'
import {
  IColorInputFieldProps,
  InferFormInputProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'

function FormColorInput({
  field,
  selectedData,
  namespace,
  handleChange
}: InferFormInputProps<IColorInputFieldProps>) {
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
