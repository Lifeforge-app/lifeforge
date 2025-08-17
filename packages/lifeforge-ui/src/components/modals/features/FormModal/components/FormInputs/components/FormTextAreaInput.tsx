import { TextAreaInput } from '@components/inputs'
import {
  type FormInputProps,
  type TextAreaFieldProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'

function FormTextAreaInput({
  field,
  value,
  namespace,
  handleChange
}: FormInputProps<TextAreaFieldProps>) {
  return (
    <TextAreaInput
      disabled={field.disabled}
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
