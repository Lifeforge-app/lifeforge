import { RRuleInput } from '@components/inputs'

import type {
  BaseFieldProps,
  FormInputProps
} from '../../../typescript/form.types'

export type RRuleFieldProps = BaseFieldProps<string, string> & {
  type: 'rrule'
  hasDuration?: boolean
}

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
