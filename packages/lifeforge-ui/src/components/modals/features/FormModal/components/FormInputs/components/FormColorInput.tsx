import { ColorInput } from '@components/inputs'
import {
  IColorInputFieldProps,
  IFieldProps
} from '@components/modals/features/FormModal/typescript/modal_interfaces'

interface FormColorInputProps<T> {
  field: IFieldProps<T> & IColorInputFieldProps
  selectedData: string
  namespace: string
  handleChange: (value: string) => void
}

function FormColorInput<T>({
  field,
  selectedData,
  namespace,
  handleChange
}: FormColorInputProps<T>) {
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
