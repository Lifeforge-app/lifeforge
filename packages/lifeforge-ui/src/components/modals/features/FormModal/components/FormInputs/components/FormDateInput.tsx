import { DateInput } from '@components/inputs'
import {
  type DateFieldProps,
  type FormInputProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'

function FormDateInput({
  field,
  selectedData,
  namespace,
  handleChange
}: FormInputProps<DateFieldProps>) {
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
