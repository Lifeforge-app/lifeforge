import { CurrencyInput } from '@components/inputs'
import {
  ICurrencyInputFieldProps,
  IFieldProps
} from '@components/modals/features/FormModal/typescript/modal_interfaces'

interface FormCurrencyInputProps<T> {
  field: IFieldProps<T> & ICurrencyInputFieldProps
  selectedData: number
  namespace: string
  handleChange: (value: number) => void
}

function FormCurrencyInput<T>({
  field,
  selectedData,
  namespace,
  handleChange
}: FormCurrencyInputProps<T>) {
  return (
    <CurrencyInput
      darker
      disabled={field.disabled}
      icon={field.icon}
      name={field.label}
      namespace={namespace}
      placeholder="0.00"
      required={field.required}
      setValue={handleChange}
      value={selectedData}
    />
  )
}

export default FormCurrencyInput
