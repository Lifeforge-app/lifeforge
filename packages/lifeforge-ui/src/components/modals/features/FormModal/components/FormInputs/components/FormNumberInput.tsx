import { NumberInput } from '@components/inputs'
import {
  type FormInputProps,
  type NumberFieldProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'

function FormNumberInput({
  field,
  selectedData,
  namespace,
  handleChange
}: FormInputProps<NumberFieldProps>) {
  return (
    <NumberInput
      darker
      disabled={field.disabled}
      icon={field.icon}
      name={field.label}
      namespace={namespace}
      placeholder={field.placeholder}
      required={field.required}
      setValue={handleChange}
      value={selectedData}
    />
  )
}

export default FormNumberInput
