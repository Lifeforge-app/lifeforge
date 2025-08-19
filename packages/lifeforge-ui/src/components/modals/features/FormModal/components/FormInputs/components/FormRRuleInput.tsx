import { RRuleInput } from '@components/inputs'
import {
  type FormInputProps,
  type RRuleFieldProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'

function FormRRuleInput({
  field,
  value,
  handleChange
}: FormInputProps<RRuleFieldProps>) {
  return (
    <RRuleInput
      hasDuration={!!field.hasDuration}
      setValue={handleChange}
      value={value}
    />
  )
}

export default FormRRuleInput
