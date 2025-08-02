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
      disabled={field.disabled}
      hasTime={field.hasTime}
      icon={field.icon}
      label={field.label}
      namespace={namespace}
      required={field.required}
      setValue={handleChange}
      value={selectedData}
    />
  )
}

export default FormDateInput
