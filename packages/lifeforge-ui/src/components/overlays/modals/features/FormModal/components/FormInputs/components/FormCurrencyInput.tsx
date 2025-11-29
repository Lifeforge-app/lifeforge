import { CurrencyInput } from '@components/inputs'

import type {
  BaseFieldProps,
  FormInputProps
} from '../../../typescript/form.types'

export type CurrencyFieldProps = BaseFieldProps<number, number, true> & {
  type: 'currency'
  icon: string
}

function FormCurrencyInput({
  field,
  value,
  autoFocus,
  namespace,
  handleChange
}: FormInputProps<CurrencyFieldProps>) {
  return (
    <CurrencyInput
      autoFocus={autoFocus}
      disabled={field.disabled}
      icon={field.icon}
      label={field.label}
      namespace={namespace}
      placeholder="0.00"
      required={field.required}
      value={value}
      onChange={handleChange}
    />
  )
}

export default FormCurrencyInput
