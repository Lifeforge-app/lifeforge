import { TextAreaInput } from '@components/inputs'
import {
  type FormInputProps,
  type TextAreaFieldProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'

function FormTextAreaInput({
  field,
  selectedData,
  namespace,
  handleChange
}: FormInputProps<TextAreaFieldProps>) {
  return (
    <TextAreaInput
      darker
      disabled={field.disabled}
      icon={field.icon}
      name={field.label}
      namespace={namespace}
      placeholder={field.placeholder}
      required={field.required}
      setValue={handleChange}
      value={selectedData}
    />
  )
}

export default FormTextAreaInput
