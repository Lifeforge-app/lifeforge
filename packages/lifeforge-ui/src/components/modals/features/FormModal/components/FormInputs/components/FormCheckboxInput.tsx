import { Switch } from '@components/buttons'
import {
  IFormCheckboxFieldProps,
  InferFormInputProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'
import { Icon } from '@iconify/react'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

function FormCheckboxInput({
  field,
  selectedData,
  namespace,
  handleChange
}: InferFormInputProps<IFormCheckboxFieldProps>) {
  const { t } = useTranslation(namespace)

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <Icon className="size-6" icon={field.icon} />
        <span className="text-lg">
          {t([
            ['inputs', _.camelCase(field.label), 'label']
              .filter(e => e)
              .join('.'),
            ['inputs', _.camelCase(field.label)].filter(e => e).join('.')
          ])}
        </span>
      </div>
      <Switch
        checked={selectedData}
        onChange={() => {
          handleChange(!selectedData)
        }}
      />
    </div>
  )
}

export default FormCheckboxInput
