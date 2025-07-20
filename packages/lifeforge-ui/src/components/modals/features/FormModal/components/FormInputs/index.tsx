import {
  IColorInputFieldProps,
  ICurrencyInputFieldProps,
  IDateInputFieldProps,
  IFieldProps,
  IFormCheckboxFieldProps,
  IFormState,
  IIconInputFieldProps,
  IImageAndFileInputFieldProps,
  IListboxInputFieldProps,
  ILocationInputFieldProps,
  INumberInputFieldProps,
  ITextAreaInputFieldProps,
  ITextInputFieldProps
} from '@components/modals/features/FormModal/typescript/modal_interfaces'

import { LocationsCustomSchemas } from 'shared/types/collections'

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

function FormInputs<T>({
  fields,
  data,
  setData,
  namespace
}: {
  fields: IFieldProps<T>[]
  data: T
  setData: React.Dispatch<React.SetStateAction<T>>
  namespace: string
}) {
  const handleChange = (field: IFieldProps<T>) => {
    return (value: IFormState[string]) => {
      setData(prev => ({ ...prev, [field.id]: value }))
    }
  }

  return (
    <div className="space-y-3">
      {fields.map(field => {
        const selectedData = data[field.id]

        if (field.hidden) {
          return <></>
        }

        switch (field.type) {
          case 'text':
            return (
              <FormTextInput
                key={field.id as string}
                field={field as IFieldProps<T> & ITextInputFieldProps}
                handleChange={handleChange(field)}
                namespace={namespace}
                selectedData={selectedData as string}
              />
            )

          case 'number':
            return (
              <FormNumberInput
                key={field.id as string}
                field={field as IFieldProps<T> & INumberInputFieldProps}
                handleChange={handleChange(field)}
                namespace={namespace}
                selectedData={selectedData as number}
              />
            )

          case 'currency':
            return (
              <FormCurrencyInput
                key={field.id as string}
                field={field as IFieldProps<T> & ICurrencyInputFieldProps}
                handleChange={handleChange(field)}
                namespace={namespace}
                selectedData={selectedData as number}
              />
            )

          case 'textarea':
            return (
              <FormTextAreaInput
                key={field.id as string}
                field={field as IFieldProps<T> & ITextAreaInputFieldProps}
                handleChange={handleChange(field)}
                namespace={namespace}
                selectedData={selectedData as string}
              />
            )
          case 'datetime':
            return (
              <FormDateInput
                key={field.id as string}
                field={field as IFieldProps<T> & IDateInputFieldProps}
                handleChange={handleChange(field)}
                namespace={namespace}
                selectedData={selectedData as Date | undefined}
              />
            )
          case 'listbox':
            return (
              <FormListboxInput
                key={field.id as string}
                field={field as IFieldProps<T> & IListboxInputFieldProps}
                handleChange={handleChange(field)}
                namespace={namespace}
                selectedData={selectedData as string | string[]}
              />
            )
          case 'color':
            return (
              <FormColorInput
                key={field.id as string}
                field={field as IFieldProps<T> & IColorInputFieldProps}
                handleChange={handleChange(field)}
                namespace={namespace}
                selectedData={selectedData as string}
              />
            )
          case 'icon':
            return (
              <FormIconInput
                key={field.id as string}
                field={field as IFieldProps<T> & IIconInputFieldProps}
                handleChange={handleChange(field)}
                namespace={namespace}
                selectedData={selectedData as string}
              />
            )
          case 'location':
            return (
              <FormLocationInput
                key={field.id as string}
                field={field as IFieldProps<T> & ILocationInputFieldProps}
                handleChange={handleChange(field)}
                namespace={namespace}
                selectedData={
                  selectedData as LocationsCustomSchemas.ILocation | null
                }
              />
            )
          case 'checkbox':
            return (
              <FormCheckboxInput
                key={field.id as string}
                field={field as IFieldProps<T> & IFormCheckboxFieldProps}
                handleChange={handleChange(field)}
                namespace={namespace}
                selectedData={selectedData as boolean}
              />
            )
          case 'file':
            return (
              <FormFileInput
                key={field.id as string}
                field={field as IFieldProps<T> & IImageAndFileInputFieldProps}
                handleChange={handleChange(field)}
                namespace={namespace}
                selectedData={
                  selectedData as {
                    image: string | File | null
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
