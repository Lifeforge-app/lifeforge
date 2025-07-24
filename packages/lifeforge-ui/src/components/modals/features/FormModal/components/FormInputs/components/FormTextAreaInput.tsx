import { TextAreaInput } from '@components/inputs'
import {
  ITextAreaInputFieldProps,
  InferFormInputProps
} from '@components/modals/features/FormModal/typescript/modal_interfaces'

function FormTextAreaInput({
  field,
  selectedData,
  namespace,
  handleChange
}: InferFormInputProps<ITextAreaInputFieldProps>) {
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
