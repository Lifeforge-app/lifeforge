import { Icon } from '@iconify/react'
import { Fragment } from 'react/jsx-runtime'

import { Flex, Text } from '@components/primitives'
import { ListboxInput, ListboxOption } from '@components/inputs'

import type {
  BaseFieldProps,
  FormInputProps
} from '../../../typescript/form.types'

export type ListboxFieldProps<
  TOption = any,
  TMultiple extends boolean = boolean,
  TFormState = any
> = BaseFieldProps<
  TMultiple extends true ? TOption[] : TOption | null,
  TMultiple extends true ? TOption[] : TOption | undefined
> & {
  type: 'listbox'
  icon: string
  multiple: TMultiple
  options:
    | Array<{
        value: TOption
        text: string
        icon?: string
        color?: string
      }>
    | ((formState: TFormState) => Array<{
        value: TOption
        text: string
        icon?: string
        color?: string
      }>)
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
  if (color && icon) {
    return <Icon height="1.25rem" icon={icon} style={{ color }} width="1.25rem" />
  }

  if (!color) {
    return <Icon height="1.25rem" icon={icon ?? ''} width="1.25rem" />
  }

  return (
    <span
      style={{
        backgroundColor: color,
        borderRadius: '9999px',
        display: 'inline-block',
        height: '0.5rem',
        width: '0.5rem'
      }}
    />
  )
}

function ListboxButtonContent({
  field,
  value,
  options
}: {
  field: ListboxFieldProps
  value: any
  options: {
    value: string
    text: string
    icon?: string
    color?: string
  }[]
}) {
  if (field.multiple === true && Array.isArray(value)) {
    return (
      <Flex align="center" gap="md" wrap="wrap">
        {value.length > 0 &&
          value.map((item: string, i: number) => (
            <Fragment key={item}>
              <Flex align="center" gap="xs">
                <Icon
                  height="1.25rem"
                  icon={options.find(l => l.value === item)?.icon ?? ''}
                  style={{
                    color: options.find(l => l.value === item)?.color
                  }}
                  width="1.25rem"
                />
                <Text truncate>
                  {options.find(l => l.value === item)?.text ?? 'None'}
                </Text>
              </Flex>
              {i !== value.length - 1 && (
                <Icon height="0.25rem" icon="tabler:circle-filled" width="0.25rem" />
              )}
            </Fragment>
          ))}
      </Flex>
    )
  }

  const targetOption = options.find(l => l.value === value)

  if (!targetOption) {
    return <Text>None</Text>
  }

  return (
    <>
      <OptionColorAndIcon color={targetOption.color} icon={targetOption.icon} />
      <Text truncate>
        {options.find(l => l.value === value)?.text ?? 'None'}
      </Text>
    </>
  )
}

export function FormListboxInput({
  field,
  value,
  namespace,
  handleChange,
  options
}: FormInputProps<ListboxFieldProps>) {
  if (!options) {
    return null
  }

  return (
    <ListboxInput
      buttonContent={
        <ListboxButtonContent field={field} options={options} value={value} />
      }
      disabled={field.disabled}
      errorMsg={field.errorMsg}
      hasActionButton={!!field.actionButtonOption}
      icon={field.icon}
      label={field.label}
      multiple={!!field.multiple}
      namespace={namespace}
      required={field.required}
      value={value}
      onChange={val => {
        if (Array.isArray(val) && val.includes(null)) {
          val = val.filter(v => v !== null)
        }

        if (val === null) {
          return
        }

        handleChange(val)
      }}
    >
      {options.map(({ text, color, icon, value: v }) => (
        <ListboxOption
          key={v}
          color={color}
          icon={icon}
          label={text}
          selected={JSON.stringify(v) === JSON.stringify(value)}
          value={v}
        />
      ))}
      {field.actionButtonOption && (
        <ListboxOption
          icon={field.actionButtonOption.icon}
          label={field.actionButtonOption.text}
          selected={false}
          value={null}
          onClick={field.actionButtonOption.onClick}
        />
      )}
    </ListboxInput>
  )
}
