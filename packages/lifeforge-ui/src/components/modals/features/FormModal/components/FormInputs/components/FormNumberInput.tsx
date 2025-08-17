import { NumberInput } from '@components/inputs'
import {
  type FormInputProps,
  type NumberFieldProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'

function FormNumberInput({
  field,
  value,
  namespace,
  handleChange
}: FormInputProps<NumberFieldProps>) {
  return (
    <NumberInput
      disabled={field.disabled}
      errorMsg={field.errorMsg}
      icon={field.icon}
      label={field.label}
      namespace={namespace}
      required={field.required}
      setValue={handleChange}
      value={value}
    />
  )
}

export default FormNumberInput
