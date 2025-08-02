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
      value={selectedData}
      label={field.label}
      namespace={namespace}
      required={field.required}
      setValue={handleChange}
    />
  )
}

export default FormIconInput
