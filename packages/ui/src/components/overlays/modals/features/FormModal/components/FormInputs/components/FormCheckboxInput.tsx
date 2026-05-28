import _ from 'lodash'
import { useTranslation } from 'react-i18next'

import { Switch } from '@/components/inputs'
import { Flex, Icon, Text } from '@/components/primitives'

import type {
  BaseFieldProps,
  FormInputProps
} from '../../../typescript/form.types'

export type CheckboxFieldProps = BaseFieldProps<boolean, boolean> & {
  type: 'checkbox'
  icon: string
}

export function FormCheckboxInput({
  field,
  value,
  namespace,
  handleChange
}: FormInputProps<CheckboxFieldProps>) {
  const { t } = useTranslation(namespace)

  return (
    <Flex direction="column" gap="sm" width="100%">
      <Flex align="center" justify="between" py="sm">
        <Flex align="center" gap="sm">
          <Icon icon={field.icon} size="1.5em" />
          <Text size="lg">
            {t([
              ['inputs', _.camelCase(field.label), 'label']
                .filter(e => e)
                .join('.'),
              ['inputs', _.camelCase(field.label)].filter(e => e).join('.')
            ])}
          </Text>
        </Flex>
        <Switch
          disabled={field.disabled}
          value={value}
          onChange={() => {
            handleChange(!value)
          }}
        />
      </Flex>
      {field.errorMsg && (
        <Text color="dangerous" size="sm">
          {field.errorMsg}
        </Text>
      )}
    </Flex>
  )
}
