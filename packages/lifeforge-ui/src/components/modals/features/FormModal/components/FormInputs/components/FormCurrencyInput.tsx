import { CurrencyInput } from '@components/inputs'
import {
  type CurrencyFieldProps,
  type FormInputProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'

function FormCurrencyInput({
  field,
  value,
  namespace,
  handleChange
}: FormInputProps<CurrencyFieldProps>) {
  return (
    <CurrencyInput
      disabled={field.disabled}
      icon={field.icon}
      label={field.label}
      namespace={namespace}
      placeholder="0.00"
      required={field.required}
      setValue={handleChange}
      value={value}
    />
  )
}

export default FormCurrencyInput
