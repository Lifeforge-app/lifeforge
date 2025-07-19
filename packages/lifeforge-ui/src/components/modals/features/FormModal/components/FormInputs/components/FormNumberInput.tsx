import { NumberInput } from '@components/inputs'
import {
  IFieldProps,
  INumberInputFieldProps
} from '@components/modals/features/FormModal/typescript/modal_interfaces'

interface FormNumberInputProps<T> {
  field: IFieldProps<T> & INumberInputFieldProps
  selectedData: number
  namespace: string
  handleChange: (value: number) => void
}

function FormNumberInput<T>({
  field,
  selectedData,
  namespace,
  handleChange
}: FormNumberInputProps<T>) {
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
