import { Icon } from '@iconify/react'
import { Fragment } from 'react/jsx-runtime'

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
    return <Icon className="size-5" icon={icon} style={{ color }} />
  }

  if (!color) {
    return <Icon className="size-5" icon={icon ?? ''} />
  }

  return (
    <span
      className="size-2 rounded-full"
      style={{
        backgroundColor: color
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
      <div className="flex flex-wrap items-center gap-3">
        {value.length > 0 &&
          value.map((item: string, i: number) => (
            <Fragment key={item}>
              <div className="flex items-center gap-1">
                <Icon
                  className="size-5"
                  icon={options.find(l => l.value === item)?.icon ?? ''}
                  style={{
                    color: options.find(l => l.value === item)?.color
                  }}
                />
                <span className="-mt-px block truncate">
                  {options.find(l => l.value === item)?.text ?? 'None'}
                </span>
              </div>
              {i !== value.length - 1 && (
                <Icon className="size-1" icon="tabler:circle-filled" />
              )}
            </Fragment>
          ))}
      </div>
    )
  }

  const targetOption = options.find(l => l.value === value)

  if (!targetOption) {
    return <span>None</span>
  }

  return (
    <>
      <OptionColorAndIcon color={targetOption.color} icon={targetOption.icon} />
      <span className="-mt-px block truncate">
        {options.find(l => l.value === value)?.text ?? 'None'}
      </span>
    </>
  )
}

function FormListboxInput({
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

export default FormListboxInput
