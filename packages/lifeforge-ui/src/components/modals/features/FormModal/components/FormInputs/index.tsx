/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useMemo } from 'react'

import {
  type FieldsConfig,
  type FormFieldPropsUnion,
  type FormInputProps,
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
const COMPONENT_MAP: Record<
  FormFieldPropsUnion['type'],
  React.FC<FormInputProps<any>>
> = {
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
}

// Memoized individual form field component to prevent unnecessary rerenders
const MemoizedFormField = memo(
  ({
    id,
    field,
    value,
    autoFocus,
    namespace,
    errorMsg,
    onFieldChange
  }: {
    id: string
    field: FormFieldPropsUnion
    value: any
    autoFocus?: boolean
    namespace?: string
    errorMsg?: string
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
        autoFocus={autoFocus}
        field={{ ...field, errorMsg }}
        handleChange={onFieldChange}
        namespace={namespace}
        value={value}
      />
    )
  }
)

MemoizedFormField.displayName = 'MemoizedFormField'

function FormInputs<T extends FormState>({
  fields,
  autoFocusableFieldId,
  data,
  setData,
  errorMsgs,
  removeErrorMsg,
  namespace
}: {
  fields: FieldsConfig<T>
  autoFocusableFieldId?: string
  data: T
  setData: React.Dispatch<React.SetStateAction<T>>
  errorMsgs: Record<string, string | undefined>
  removeErrorMsg: (fieldId: string) => void
  namespace?: string
}) {
  const changeHandlers = useMemo(() => {
    const handlers: Record<string, (value: any) => void> = {}

    Object.keys(fields).forEach(id => {
      handlers[id] = (value: any) => {
        setData(prev => ({ ...prev, [id]: value }))
        removeErrorMsg(id)
      }
    })

    return handlers
  }, [fields, setData])

  return (
    <div className="space-y-3">
      {Object.entries(fields).map(([id, field]) => {
        // Render corresponding form field component based on field type
        const value = data[id]

        const errorMsg = errorMsgs[id]

        return (
          <MemoizedFormField
            key={id}
            autoFocus={autoFocusableFieldId === id}
            errorMsg={errorMsg}
            field={field}
            id={id}
            namespace={namespace}
            value={value}
            onFieldChange={changeHandlers[id]}
          />
        )
      })}
    </div>
  )
}

export default FormInputs
