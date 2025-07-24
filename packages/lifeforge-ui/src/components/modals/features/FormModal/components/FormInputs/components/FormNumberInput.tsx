import { NumberInput } from '@components/inputs'
import {
  INumberInputFieldProps,
  InferFormInputProps
} from '@components/modals/features/FormModal/typescript/modal_interfaces'

function FormNumberInput({
  field,
  selectedData,
  namespace,
  handleChange
}: InferFormInputProps<INumberInputFieldProps>) {
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
