import { DateInput } from '@components/inputs'
import {
  type DateFieldProps,
  type FormInputProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'

function FormDateInput({
  field,
  value,
  autoFocus,
  namespace,
  handleChange
}: FormInputProps<DateFieldProps>) {
  return (
    <DateInput
      autoFocus={autoFocus}
      disabled={field.disabled}
      hasTime={field.hasTime}
      icon={field.icon}
      label={field.label}
      namespace={namespace}
      required={field.required}
      setValue={handleChange}
      value={value}
    />
  )
}

export default FormDateInput
