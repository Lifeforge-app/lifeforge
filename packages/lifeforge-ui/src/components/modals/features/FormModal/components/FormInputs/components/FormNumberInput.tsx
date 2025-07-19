import { TextInput } from '@components/inputs'
import {
  IFieldProps,
  INumberInputFieldProps
} from '@components/modals/features/FormModal/typescript/modal_interfaces'
import { useEffect, useState } from 'react'

interface FormNumberInputProps<T> {
  field: IFieldProps<T> & INumberInputFieldProps
  selectedData: number
  namespace: string
  handleChange: (value: number) => void
}

function FormNumberInput<T>({
  field,
  selectedData,
  namespace,
  handleChange
}: FormNumberInputProps<T>) {
  const [currentStringValue, setCurrentStringValue] = useState<string>(
    selectedData.toString() === '0' ? '' : selectedData.toString()
  )

  useEffect(() => {
    setCurrentStringValue(
      selectedData.toString() === '0' ? '' : selectedData.toString()
    )
  }, [selectedData])

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

export default FormNumberInput
