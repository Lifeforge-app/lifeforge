import { IconInput } from '@components/inputs'
import {
  type FormInputProps,
  type IconFieldProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'

function FormIconInput({
  field,
  selectedData,
  namespace,
  handleChange
}: FormInputProps<IconFieldProps>) {
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
