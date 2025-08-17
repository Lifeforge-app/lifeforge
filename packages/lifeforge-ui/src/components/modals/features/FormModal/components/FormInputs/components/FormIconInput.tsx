import { IconInput } from '@components/inputs'
import {
  type FormInputProps,
  type IconFieldProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'

function FormIconInput({
  field,
  value,
  namespace,
  handleChange
}: FormInputProps<IconFieldProps>) {
  return (
    <IconInput
      disabled={field.disabled}
      label={field.label}
      errorMsg={field.errorMsg}
      namespace={namespace}
      required={field.required}
      setValue={handleChange}
      value={value}
    />
  )
}

export default FormIconInput
