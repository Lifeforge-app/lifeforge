import { ColorInput } from '@components/inputs'
import {
  type ColorFieldProps,
  type FormInputProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'

function FormColorInput({
  field,
  value,
  autoFocus,
  namespace,
  handleChange
}: FormInputProps<ColorFieldProps>) {
  return (
    <ColorInput
      autoFocus={autoFocus}
      disabled={field.disabled}
      errorMsg={field.errorMsg}
      label={field.label}
      namespace={namespace}
      required={field.required}
      setValue={handleChange}
      value={value}
    />
  )
}

export default FormColorInput
