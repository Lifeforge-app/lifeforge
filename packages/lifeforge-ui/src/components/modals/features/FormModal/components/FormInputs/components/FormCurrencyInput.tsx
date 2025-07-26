import { CurrencyInput } from '@components/inputs'
import {
  type CurrencyFieldProps,
  type FormInputProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'

function FormCurrencyInput({
  field,
  selectedData,
  namespace,
  handleChange
}: FormInputProps<CurrencyFieldProps>) {
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
