import { IconInput } from '@components/controls'

import type {
  BaseFieldProps,
  FormInputProps
} from '../../../typescript/form.types'

export type IconFieldProps = BaseFieldProps<string, string, true> & {
  type: 'icon'
}

function FormIconInput({
  field,
  value,
  autoFocus,
  namespace,
  handleChange
}: FormInputProps<IconFieldProps>) {
  return (
    <IconInput
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

export default FormIconInput
