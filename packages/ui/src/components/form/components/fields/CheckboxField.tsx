import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController
} from 'react-hook-form'

import { Switch } from '@/components/inputs'
import { useInputLabel } from '@/components/inputs/shared/hooks/useInputLabel'
import { Flex, Icon, Text } from '@/components/primitives'

import { useNamespace } from '../FormModal'

type CheckboxFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPathByValue<TFieldValues, boolean | null | undefined>
  label: string
  icon: string
  disabled?: boolean
  namespace?: string | false
}

export function CheckboxField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  icon,
  disabled = false,
  namespace
}: CheckboxFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({
    control,
    name
  })

  const contextNamespace = useNamespace()

  const activeNamespace = namespace ?? contextNamespace

  const labelText = useInputLabel({ label, namespace: activeNamespace })

  function handleSwitchChange() {
    field.onChange(!field.value)
  }

  return (
    <Flex direction="column" gap="sm" width="100%">
      <Flex align="center" justify="between" py="sm">
        <Flex align="center" gap="sm">
          <Icon icon={icon} size="1.5em" />
          <Text size="lg">{labelText}</Text>
        </Flex>
        <Switch
          disabled={disabled}
          value={!!field.value}
          onChange={handleSwitchChange}
        />
      </Flex>
      {fieldState.error?.message && (
        <Text color="dangerous" size="sm">
          {fieldState.error.message}
        </Text>
      )}
    </Flex>
  )
}
