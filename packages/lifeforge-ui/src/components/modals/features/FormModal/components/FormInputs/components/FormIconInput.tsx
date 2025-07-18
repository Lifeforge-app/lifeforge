import { IconInput } from '@components/inputs'
import {
  IFieldProps,
  IIconInputFieldProps
} from '@components/modals/features/FormModal/typescript/modal_interfaces'

interface FormIconInputProps<T> {
  field: IFieldProps<T> & IIconInputFieldProps
  selectedData: string
  namespace: string
  handleChange: (value: string) => void
}

function FormIconInput<T>({
  field,
  selectedData,
  namespace,
  handleChange
}: FormIconInputProps<T>) {
  return (
    <IconInput
      disabled={field.disabled}
      icon={selectedData}
      name={field.label}
      namespace={namespace}
      required={field.required}
      setIcon={handleChange}
    />
  )
}

export default FormIconInput
