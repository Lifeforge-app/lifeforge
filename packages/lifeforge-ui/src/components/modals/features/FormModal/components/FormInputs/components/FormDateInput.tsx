import { DateInput } from '@components/inputs'

import type {
  BaseFieldProps,
  FormInputProps
} from '../../../typescript/form.types'

export type DateFieldProps = BaseFieldProps<Date | null, string, true> & {
  type: 'datetime'
  icon: string
  hasTime?: boolean
}

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
