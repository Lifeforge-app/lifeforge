import {
  Field,
  FormFieldConfig,
  IColorInputFieldProps,
  ICurrencyInputFieldProps,
  IDateInputFieldProps,
  IFormCheckboxFieldProps,
  IFormState,
  IIconInputFieldProps,
  IImageAndFileInputFieldProps,
  IListboxInputFieldProps,
  ILocationInputFieldProps,
  INumberInputFieldProps,
  ITextAreaInputFieldProps,
  ITextInputFieldProps,
  Location
} from '@components/modals/features/FormModal/typescript/modal_interfaces'

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

        if (field.hidden) {
          return <></>
        }

        switch (field.type) {
          case 'text':
            return (
              <FormTextInput
                key={field.id as string}
                field={field as Field<ITextInputFieldProps>}
                handleChange={handleChange(field)}
                namespace={namespace}
                selectedData={selectedData as string}
              />
            )

          case 'number':
            return (
              <FormNumberInput
                key={field.id as string}
                field={field as Field<INumberInputFieldProps>}
                handleChange={handleChange(field)}
                namespace={namespace}
                selectedData={selectedData as number}
              />
            )

          case 'currency':
            return (
              <FormCurrencyInput
                key={field.id as string}
                field={field as Field<ICurrencyInputFieldProps>}
                handleChange={handleChange(field)}
                namespace={namespace}
                selectedData={selectedData as number}
              />
            )

          case 'textarea':
            return (
              <FormTextAreaInput
                key={field.id as string}
                field={field as Field<ITextAreaInputFieldProps>}
                handleChange={handleChange(field)}
                namespace={namespace}
                selectedData={selectedData as string}
              />
            )
          case 'datetime':
            return (
              <FormDateInput
                key={field.id as string}
                field={field as Field<IDateInputFieldProps>}
                handleChange={handleChange(field)}
                namespace={namespace}
                selectedData={selectedData as Date | null}
              />
            )
          case 'listbox':
            return (
              <FormListboxInput
                key={field.id as string}
                field={field as Field<IListboxInputFieldProps>}
                handleChange={handleChange(field)}
                namespace={namespace}
                selectedData={selectedData as string | string[]}
              />
            )
          case 'color':
            return (
              <FormColorInput
                key={field.id as string}
                field={field as Field<IColorInputFieldProps>}
                handleChange={handleChange(field)}
                namespace={namespace}
                selectedData={selectedData as string}
              />
            )
          case 'icon':
            return (
              <FormIconInput
                key={field.id as string}
                field={field as Field<IIconInputFieldProps>}
                handleChange={handleChange(field)}
                namespace={namespace}
                selectedData={selectedData as string}
              />
            )
          case 'location':
            return (
              <FormLocationInput
                key={field.id as string}
                field={field as Field<ILocationInputFieldProps>}
                handleChange={handleChange(field)}
                namespace={namespace}
                selectedData={selectedData as Location | null}
              />
            )
          case 'checkbox':
            return (
              <FormCheckboxInput
                key={field.id as string}
                field={field as Field<IFormCheckboxFieldProps>}
                handleChange={handleChange(field)}
                namespace={namespace}
                selectedData={selectedData as boolean}
              />
            )
          case 'file':
            return (
              <FormFileInput
                key={field.id as string}
                field={field as Field<IImageAndFileInputFieldProps>}
                handleChange={handleChange(field)}
                namespace={namespace}
                selectedData={
                  selectedData as {
                    file: string | File | null
                    preview: string | null
                  }
                }
              />
            )
          default:
            return <></>
        }
      })}
    </div>
  )
}

export default FormInputs
