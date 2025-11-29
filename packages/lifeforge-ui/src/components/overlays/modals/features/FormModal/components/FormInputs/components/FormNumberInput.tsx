import { NumberInput } from '@components/inputs'

import type {
  BaseFieldProps,
  FormInputProps
} from '../../../typescript/form.types'

export type NumberFieldProps = BaseFieldProps<number, number, true> & {
  type: 'number'
  icon: string
}

function FormNumberInput({
  field,
  value,
  autoFocus,
  namespace,
  handleChange
}: FormInputProps<NumberFieldProps>) {
  return (
    <NumberInput
      autoFocus={autoFocus}
      disabled={field.disabled}
      errorMsg={field.errorMsg}
      icon={field.icon}
      label={field.label}
      namespace={namespace}
      required={field.required}
      value={value}
      onChange={handleChange}
    />
  )
}

export default FormNumberInput
