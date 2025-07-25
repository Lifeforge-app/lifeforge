import { DateInput } from '@components/inputs'
import {
  IDateInputFieldProps,
  InferFormInputProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'

function FormDateInput({
  field,
  selectedData,
  namespace,
  handleChange
}: InferFormInputProps<IDateInputFieldProps>) {
  return (
    <DateInput
      darker
      date={selectedData}
      disabled={field.disabled}
      hasTime={field.hasTime}
      icon={field.icon}
      name={field.label}
      namespace={namespace}
      required={field.required}
      setDate={handleChange}
    />
  )
}

export default FormDateInput
