import { LocationInput } from '@components/inputs'
import {
  IFieldProps,
  ILocationInputFieldProps
} from '@components/modals/features/FormModal/typescript/modal_interfaces'

import { LocationsCustomSchemas } from 'shared/types/collections'

interface FormLocationInputProps<T> {
  field: IFieldProps<T> & ILocationInputFieldProps
  selectedData: LocationsCustomSchemas.ILocation | null
  namespace: string
  handleChange: (value: LocationsCustomSchemas.ILocation | null) => void
}

function FormLocationInput<T>({
  field,
  selectedData,
  namespace,
  handleChange
}: FormLocationInputProps<T>) {
  return (
    <LocationInput
      disabled={field.disabled}
      label={field.label}
      location={selectedData}
      namespace={namespace}
      required={field.required}
      setLocation={value => handleChange(value)}
    />
  )
}

export default FormLocationInput
