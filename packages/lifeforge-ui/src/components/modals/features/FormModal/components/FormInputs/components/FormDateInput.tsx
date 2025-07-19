import { DateInput } from '@components/inputs'
import {
  IDateInputFieldProps,
  IFieldProps
} from '@components/modals/features/FormModal/typescript/modal_interfaces'

interface FormDateInputProps<T> {
  field: IFieldProps<T> & IDateInputFieldProps
  selectedData: Date | undefined
  namespace: string
  handleChange: (value: Date | undefined) => void
}

function FormDateInput<T>({
  field,
  selectedData,
  namespace,
  handleChange
}: FormDateInputProps<T>) {
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
