import { TextAreaInput } from '@components/inputs'

import type {
  BaseFieldProps,
  FormInputProps
} from '../../../typescript/form.types'

export type TextAreaFieldProps = BaseFieldProps<string, string, true> & {
  type: 'textarea'
  icon: string
  placeholder: string
}

function FormTextAreaInput({
  field,
  value,
  autoFocus,
  namespace,
  handleChange
}: FormInputProps<TextAreaFieldProps>) {
  return (
    <TextAreaInput
      autoFocus={autoFocus}
      disabled={field.disabled}
      errorMsg={field.errorMsg}
      icon={field.icon}
      label={field.label}
      namespace={namespace}
      placeholder={field.placeholder}
      required={field.required}
      setValue={handleChange}
      value={value}
    />
  )
}

export default FormTextAreaInput
