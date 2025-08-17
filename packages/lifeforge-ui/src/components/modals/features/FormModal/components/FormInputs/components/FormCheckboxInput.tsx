import { Switch } from '@components/buttons'
import {
  type CheckboxFieldProps,
  type FormInputProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'
import { Icon } from '@iconify/react'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

function FormCheckboxInput({
  field,
  value,
  namespace,
  handleChange
}: FormInputProps<CheckboxFieldProps>) {
  const { t } = useTranslation(namespace)

  return (
    <div className="w-full space-y-2">
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
          checked={value}
          onChange={() => {
            handleChange(!value)
          }}
        />
      </div>
      {field.errorMsg && (
        <div className="text-sm text-red-500">{field.errorMsg}</div>
      )}
    </div>
  )
}

export default FormCheckboxInput
