import { ColorInput } from '@components/inputs'

import type {
  BaseFieldProps,
  FormInputProps
} from '../../../typescript/form.types'

export type ColorFieldProps = BaseFieldProps<string, string, true> & {
  type: 'color'
}

function FormColorInput({
  field,
  value,
  autoFocus,
  namespace,
  handleChange
}: FormInputProps<ColorFieldProps>) {
  return (
    <ColorInput
      autoFocus={autoFocus}
      disabled={field.disabled}
      errorMsg={field.errorMsg}
      label={field.label}
      namespace={namespace}
      required={field.required}
      value={value}
      onChange={handleChange}
    />
  )
}

export default FormColorInput
