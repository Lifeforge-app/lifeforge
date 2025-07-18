import { Icon } from '@iconify/react'
import { Fragment } from 'react/jsx-runtime'

import {
  ListboxNullOption,
  ListboxOrComboboxInput,
  ListboxOrComboboxOption
} from '@components/inputs'
import {
  IFieldProps,
  IListboxInputFieldProps
} from '@components/modals/features/FormModal/typescript/modal_interfaces'

interface FormListboxInputProps<T> {
  field: IFieldProps<T> & IListboxInputFieldProps
  selectedData: string | string[]
  namespace: string
  handleChange: (value: string | string[]) => void
}

function FormListboxInput<T>({
  field,
  selectedData,
  namespace,
  handleChange
}: FormListboxInputProps<T>) {
  return (
    <ListboxOrComboboxInput
      buttonContent={
        field.multiple === true && Array.isArray(selectedData) ? (
          <>
            {selectedData.length > 0 ? (
              selectedData.map((item: string, i: number) => (
                <Fragment key={item}>
                  <Icon
                    className="size-5"
                    icon={field.options.find(l => l.value === item)?.icon ?? ''}
                  />
                  <span className="-mt-px block truncate">
                    {field.options.find(l => l.value === item)?.text ?? 'None'}
                  </span>
                  {i !== selectedData.length - 1 && (
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
          </>
        ) : (
          <>
            {!!(
              field.options.find(l => l.value === selectedData)?.icon ??
              field.nullOption
            ) && (
              <Icon
                className="size-5"
                icon={
                  field.options.find(l => l.value === selectedData)?.icon ??
                  field.nullOption ??
                  ''
                }
                style={{
                  color: field.options.find(l => l.value === selectedData)
                    ?.color
                }}
              />
            )}
            {field.options.length &&
              field.options[0].icon === undefined &&
              field.options[0].color !== undefined && (
                <span
                  className="size-2 rounded-full"
                  style={{
                    backgroundColor: field.options.find(
                      l => l.value === selectedData
                    )?.color
                  }}
                />
              )}
            <span className="-mt-px block truncate">
              {field.options.find(l => l.value === selectedData)?.text ??
                'None'}
            </span>
          </>
        )
      }
      disabled={field.disabled}
      icon={field.icon}
      multiple={field.multiple}
      name={field.label}
      namespace={namespace}
      required={field.required}
      setValue={handleChange}
      type="listbox"
      value={selectedData}
    >
      {field.nullOption !== undefined && (
        <ListboxNullOption
          hasBgColor={field.options[0]?.color !== undefined}
          icon={field.nullOption}
        />
      )}
      {field.options.map(({ text, color, icon, value }) => (
        <ListboxOrComboboxOption
          key={value}
          color={color}
          icon={icon}
          text={text}
          value={value}
        />
      ))}
    </ListboxOrComboboxInput>
  )
}

export default FormListboxInput
