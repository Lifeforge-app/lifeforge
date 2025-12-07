import { SliderInput } from '@components/inputs'

import type {
  BaseFieldProps,
  FormInputProps
} from '../../../typescript/form.types'

export type SliderFieldProps = BaseFieldProps<number, number, true> & {
  type: 'slider'
  icon?: string
  min?: number
  max?: number
  step?: number
}

function FormSliderInput({
  field,
  value,
  namespace,
  handleChange
}: FormInputProps<SliderFieldProps>) {
  return (
    <SliderInput
      disabled={field.disabled}
      icon={field.icon}
      label={field.label}
      max={field.max}
      min={field.min}
      namespace={namespace}
      required={field.required}
      step={field.step}
      value={value}
      onChange={handleChange}
    />
  )
}

export default FormSliderInput
