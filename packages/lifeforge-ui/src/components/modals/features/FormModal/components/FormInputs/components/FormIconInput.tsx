import { IconInput } from '@components/inputs'
import {
  type FormInputProps,
  type IconFieldProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'

function FormIconInput({
  field,
  value,
  autoFocus,
  namespace,
  handleChange
}: FormInputProps<IconFieldProps>) {
  return (
    <IconInput
      autoFocus={autoFocus}
      disabled={field.disabled}
      errorMsg={field.errorMsg}
      label={field.label}
      namespace={namespace}
      required={field.required}
      setValue={handleChange}
      value={value}
    />
  )
}

export default FormIconInput
