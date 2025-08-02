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
      disabled={field.disabled}
      icon={field.icon}
      label={field.label}
      namespace={namespace}
      required={field.required}
      setValue={handleChange}
      value={selectedData}
    />
  )
}

export default FormNumberInput
