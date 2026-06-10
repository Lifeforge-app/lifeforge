import { Fragment } from 'react'
import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController
} from 'react-hook-form'

import { ListboxInput, ListboxOption } from '@/components/inputs'
import { Box, Flex, Icon, Text } from '@/components/primitives'

import { useNamespace } from '../FormModal'

type ListboxOptionType<TOption> = {
  value: TOption
  text: string
  icon?: string
  color?: string
}

type ListboxFieldProps<TFieldValues extends FieldValues, TOption> = {
  control: Control<TFieldValues>
  name: FieldPathByValue<TFieldValues, TOption | TOption[] | null | undefined>
  icon: string
  label: string
  multiple?: boolean
  disabled?: boolean
  namespace?: string
  required?: boolean
  options: ListboxOptionType<TOption>[]
  actionButtonOption?: {
    text: string
    onClick: () => void
    icon: string
  }
}

function OptionColorAndIcon({
  color,
  icon
}: {
  color?: string
  icon?: string
}) {
  if (!color && !icon) return null

  if (color && icon) {
    return <Icon icon={icon} style={{ color }} />
  }

  if (!color) {
    return <Icon icon={icon ?? ''} />
  }

  return (
    <Box
      display="inline-block"
      flexShrink="0"
      height="0.75em"
      r="full"
      style={{
        backgroundColor: color
      }}
      width="0.75em"
    />
  )
}

function ListboxButtonContent<TOption>({
  multiple,
  value,
  options
}: {
  multiple?: boolean
  value: unknown
  options: ListboxOptionType<TOption>[]
}) {
  if (multiple === true && Array.isArray(value)) {
    return (
      <Flex align="center" gap="md" wrap="wrap">
        {value.length > 0 &&
          value.map(function (item: TOption, i: number) {
            const target = options.find(function (l) {
              return l.value === item
            })

            return (
              <Fragment key={String(item)}>
                <Flex align="center" gap="xs">
                  <Icon
                    icon={target?.icon ?? ''}
                    style={{
                      color: target?.color
                    }}
                  />
                  <Text truncate>{target?.text ?? 'None'}</Text>
                </Flex>
                {i !== value.length - 1 && (
                  <Icon icon="tabler:circle-filled" size="0.25em" />
                )}
              </Fragment>
            )
          })}
      </Flex>
    )
  }

  const targetOption = options.find(function (l) {
    return l.value === value
  })

  if (!targetOption) {
    return <Text>None</Text>
  }

  return (
    <Flex align="center" gap="sm">
      <OptionColorAndIcon color={targetOption.color} icon={targetOption.icon} />
      <Text truncate>{targetOption.text}</Text>
    </Flex>
  )
}

export function ListboxField<TFieldValues extends FieldValues, TOption>({
  control,
  name,
  icon,
  label,
  multiple = false,
  disabled = false,
  namespace,
  required = false,
  options,
  actionButtonOption
}: ListboxFieldProps<TFieldValues, TOption>) {
  const { field, fieldState } = useController({
    control,
    name
  })
  const contextNamespace = useNamespace()

  const activeNamespace = namespace ?? contextNamespace

  function handleListboxChange(val: unknown) {
    let cleanVal = val

    if (Array.isArray(cleanVal) && cleanVal.includes(null)) {
      cleanVal = cleanVal.filter(function (v) {
        return v !== null
      })
    }

    if (cleanVal === null) {
      return
    }

    field.onChange(cleanVal)
  }

  function handleRenderContent() {
    return (
      <ListboxButtonContent
        multiple={multiple}
        options={options}
        value={field.value}
      />
    )
  }

  return (
    <ListboxInput
      disabled={disabled}
      errorMsg={fieldState.error?.message}
      icon={icon}
      label={label}
      multiple={multiple}
      namespace={activeNamespace}
      renderContent={handleRenderContent}
      required={required}
      value={field.value}
      onChange={handleListboxChange}
    >
      {options.map(function ({ text, color, icon: optIcon, value: v }) {
        return (
          <ListboxOption
            key={String(v)}
            color={color}
            icon={optIcon}
            label={text}
            selected={JSON.stringify(v) === JSON.stringify(field.value)}
            value={v}
          />
        )
      })}
      {actionButtonOption && (
        <ListboxOption
          icon={actionButtonOption.icon}
          label={actionButtonOption.text}
          selected={false}
          value={null as unknown as TOption}
          onClick={actionButtonOption.onClick}
        />
      )}
    </ListboxInput>
  )
}
