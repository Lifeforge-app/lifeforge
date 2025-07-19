import { TextInput } from '@components/inputs'
import {
  IFieldProps,
  INumberInputFieldProps
} from '@components/modals/features/FormModal/typescript/modal_interfaces'
import { useState } from 'react'

interface FormTextInputProps<T> {
  field: IFieldProps<T> & INumberInputFieldProps
  selectedData: number
  namespace: string
  handleChange: (value: number) => void
}

function FormTextInput<T>({
  field,
  selectedData,
  namespace,
  handleChange
}: FormTextInputProps<T>) {
  const [currentStringValue, setCurrentStringValue] = useState<string>(
    selectedData.toString()
  )

  return (
    <TextInput
      darker
      disabled={field.disabled}
      icon={field.icon}
      name={field.label}
      namespace={namespace}
      placeholder={field.placeholder}
      required={field.required}
      setValue={(value: string) => {
        setCurrentStringValue(value)
      }}
      value={currentStringValue}
      onBlur={() => {
        const numericValue = parseInt(currentStringValue)

        if (!isNaN(numericValue)) {
          handleChange(numericValue)
        } else {
          handleChange(0)
        }
      }}
    />
  )
}

export default FormTextInput
