/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AllFields,
  FormFieldConfig,
  IFormState
} from '../../typescript/form_interfaces'
import FormCheckboxInput from './components/FormCheckboxInput'
import FormColorInput from './components/FormColorInput'
import FormCurrencyInput from './components/FormCurrencyInput'
import FormDateInput from './components/FormDateInput'
import FormFileInput from './components/FormFileInput'
import FormIconInput from './components/FormIconInput'
import FormListboxInput from './components/FormListboxInput'
import FormLocationInput from './components/FormLocationInput'
import FormNumberInput from './components/FormNumberInput'
import FormTextAreaInput from './components/FormTextAreaInput'
import FormTextInput from './components/FormTextInput'

const COMPONENT_MAP: Record<AllFields['type'], React.FC<any>> = {
  text: FormTextInput,
  number: FormNumberInput,
  currency: FormCurrencyInput,
  textarea: FormTextAreaInput,
  datetime: FormDateInput,
  listbox: FormListboxInput,
  color: FormColorInput,
  icon: FormIconInput,
  location: FormLocationInput,
  checkbox: FormCheckboxInput,
  file: FormFileInput
}

function FormInputs<T extends IFormState>({
  fields,
  data,
  setData,
  namespace
}: {
  fields: FormFieldConfig<T>
  data: T
  setData: React.Dispatch<React.SetStateAction<T>>
  namespace: string
}) {
  const handleChange = (id: keyof typeof fields) => {
    return (value: IFormState[string]) => {
      setData(prev => ({ ...prev, [id]: value }))
    }
  }

  return (
    <div className="space-y-3">
      {Object.entries(fields).map(([id, field]) => {
        const selectedData = data[id]

        const fieldType = field.type as AllFields['type']

        const FormComponent = COMPONENT_MAP[fieldType]

        if (field.hidden) {
          return <></>
        }

        return (
          <FormComponent
            key={id}
            field={field}
            handleChange={handleChange(id)}
            namespace={namespace}
            selectedData={selectedData}
          />
        )
      })}
    </div>
  )
}

export default FormInputs
