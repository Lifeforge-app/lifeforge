import { TextAreaInput } from '@components/inputs'
import {
  IFieldProps,
  ITextAreaInputFieldProps
} from '@components/modals/features/FormModal/typescript/modal_interfaces'

interface FormTextAreaInputProps<T> {
  field: IFieldProps<T> & ITextAreaInputFieldProps
  selectedData: string
  namespace: string
  handleChange: (value: string) => void
}

function FormTextAreaInput<T>({
  field,
  selectedData,
  namespace,
  handleChange
}: FormTextAreaInputProps<T>) {
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
