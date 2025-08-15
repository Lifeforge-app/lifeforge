/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useMemo } from 'react'

import {
  type FieldsConfig,
  type FormFieldPropsUnion,
  type FormState
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
import FormRRuleInput from './components/FormRRuleInput'
import FormTextAreaInput from './components/FormTextAreaInput'
import FormTextInput from './components/FormTextInput'

// Map of form field types to their corresponding components
const COMPONENT_MAP: Record<FormFieldPropsUnion['type'], React.FC<any>> = {
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
  file: FormFileInput,
  rrule: FormRRuleInput
} satisfies Record<FormFieldPropsUnion['type'], React.FC<any>>

// Memoized individual form field component to prevent unnecessary rerenders
const MemoizedFormField = memo(
  ({
    id,
    field,
    selectedData,
    namespace,
    onFieldChange
  }: {
    id: string
    field: FormFieldPropsUnion
    selectedData: any
    namespace?: string
    onFieldChange: (value: any) => void
  }) => {
    const fieldType = field.type as FormFieldPropsUnion['type']

    const FormComponent = COMPONENT_MAP[fieldType] || (() => <></>)

    if (field.hidden) {
      return null
    }

    return (
      <FormComponent
        key={id}
        field={field}
        handleChange={onFieldChange}
        namespace={namespace}
        selectedData={selectedData}
      />
    )
  }
)

MemoizedFormField.displayName = 'MemoizedFormField'

function FormInputs<T extends FormState>({
  fields,
  data,
  setData,
  namespace
}: {
  fields: FieldsConfig<T>
  data: T
  setData: React.Dispatch<React.SetStateAction<T>>
  namespace?: string
}) {
  const changeHandlers = useMemo(() => {
    const handlers: Record<string, (value: any) => void> = {}

    Object.keys(fields).forEach(id => {
      handlers[id] = (value: any) => {
        setData(prev => ({ ...prev, [id]: value }))
      }
    })

    return handlers
  }, [fields, setData])

  return (
    <div className="space-y-3">
      {Object.entries(fields).map(([id, field]) => {
        // Render corresponding form field component based on field type
        const selectedData = data[id]

        return (
          <MemoizedFormField
            key={id}
            field={field}
            id={id}
            namespace={namespace}
            selectedData={selectedData}
            onFieldChange={changeHandlers[id]}
          />
        )
      })}
    </div>
  )
}

export default FormInputs
