/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useMemo } from 'react'

import {
  type FormFieldPropsUnion,
  type FormInputProps,
  type FormState
} from '../../typescript/form.types'
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
    options,
    onFieldChange
  }: {
    id: string
    field: FormFieldPropsUnion
    value: any
    autoFocus?: boolean
    namespace?: string
    errorMsg?: string
    options?: {
      value: string
      text: string
      icon?: string
      color?: string
    }[]
    onFieldChange: (value: any) => void
  }) => {
    const fieldType = field.type as FormFieldPropsUnion['type']

    const FormComponent = COMPONENT_MAP[fieldType] || (() => <></>)

    return (
      <FormComponent
        key={id}
        autoFocus={autoFocus}
        field={{ ...field, errorMsg }}
        handleChange={onFieldChange}
        namespace={namespace}
        options={options}
        value={value}
      />
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.id === nextProps.id &&
      prevProps.value === nextProps.value &&
      prevProps.errorMsg === nextProps.errorMsg &&
      prevProps.onFieldChange === nextProps.onFieldChange &&
      JSON.stringify(prevProps.options) === JSON.stringify(nextProps.options)
    )
  }
)

MemoizedFormField.displayName = 'MemoizedFormField'

function FormInputs<T extends FormState>({
  fields,
  autoFocusableFieldId,
  conditionalFields,
  data,
  setData,
  errorMsgs,
  removeErrorMsg,
  namespace
}: {
  fields: Record<string, FormFieldPropsUnion>
  autoFocusableFieldId?: string
  conditionalFields?: {
    [K in keyof T]?: (data: T) => boolean
  }
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
        removeErrorMsg(id)
        setData(prev => ({ ...prev, [id]: value }))
      }
    })

    return handlers
  }, [fields])

  return (
    <div className="space-y-3">
      {Object.entries(fields as Record<string, FormFieldPropsUnion>).map(
        ([id, field]) => {
          // Render corresponding form field component based on field type
          const value = data[id]

          const errorMsg = errorMsgs[id]

          const conditionalCall = conditionalFields?.[id]?.(data)

          // Determine whether there is a conditional hidden state,
          // if not, the field should be visible
          const conditionalHidden =
            typeof conditionalCall === 'boolean' ? !conditionalCall : false

          // If the field is explicitly hidden, conditionalHidden should be overridden
          const hidden = field.hidden ? true : conditionalHidden

          let options:
            | {
                value: string
                text: string
                icon?: string
                color?: string
              }[]
            | undefined = undefined

          if (field.type === 'listbox') {
            if (typeof field.options === 'function') {
              options = field.options(data)
            } else {
              options = field.options
            }
          }

          if (hidden) {
            return null
          }

          return (
            <MemoizedFormField
              key={id}
              autoFocus={autoFocusableFieldId === id}
              errorMsg={errorMsg}
              field={field}
              id={id}
              namespace={namespace}
              options={options}
              value={value}
              onFieldChange={changeHandlers[id] || (() => {})}
            />
          )
        }
      )}
    </div>
  )
}

export default FormInputs
