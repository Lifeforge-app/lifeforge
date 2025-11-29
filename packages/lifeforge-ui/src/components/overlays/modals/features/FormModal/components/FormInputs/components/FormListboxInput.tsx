import { Icon } from '@iconify/react'
import { Fragment } from 'react/jsx-runtime'

import {
  ListboxInput,
  ListboxNullOption,
  ListboxOption
} from '@components/inputs'

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
  nullOption?: string
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
        field.multiple === true && Array.isArray(value) ? (
          <div className="flex flex-wrap items-center gap-3">
            {value.length > 0 ? (
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
              ))
            ) : (
              <>
                {field.nullOption !== undefined && (
                  <Icon className="size-5" icon={field.nullOption} />
                )}
                None
              </>
            )}
          </div>
        ) : (
          <>
            {!!(
              options.find(l => l.value === value)?.icon ?? field.nullOption
            ) && (
              <Icon
                className="size-5"
                icon={
                  options.find(l => l.value === value)?.icon ??
                  field.nullOption ??
                  ''
                }
                style={{
                  color: options.find(l => l.value === value)?.color
                }}
              />
            )}
            {options.length &&
              options[0].icon === undefined &&
              options[0].color !== undefined && (
                <span
                  className="size-2 rounded-full"
                  style={{
                    backgroundColor: options.find(l => l.value === value)?.color
                  }}
                />
              )}
            <span className="-mt-px block truncate">
              {options.find(l => l.value === value)?.text ?? 'None'}
            </span>
          </>
        )
      }
      disabled={field.disabled}
      errorMsg={field.errorMsg}
      icon={field.icon}
      label={field.label}
      multiple={!!field.multiple}
      namespace={namespace}
      required={field.required}
      value={value}
      onChange={handleChange}
    >
      {field.nullOption !== undefined && (
        <ListboxNullOption
          hasBgColor={options[0]?.color !== undefined}
          icon={field.nullOption}
        />
      )}
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
    </ListboxInput>
  )
}

export default FormListboxInput
