import { ListboxInput, ListboxNullOption } from '@components/inputs'
import ListboxOption from '@components/inputs/ListboxInput/components/ListboxOption'
import {
  type FormInputProps,
  type ListboxFieldProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'
import { Icon } from '@iconify/react'
import { useEffect } from 'react'
import { Fragment } from 'react/jsx-runtime'

function FormListboxInput({
  field,
  value,
  namespace,
  handleChange
}: FormInputProps<ListboxFieldProps>) {
  useEffect(() => {
    if (field.multiple) {
      handleChange(
        value.map(
          (item: { value: string }) =>
            field.options.find(option => option.value === item)?.value
        )
      )
    } else {
      handleChange(field.options.find(option => option.value === value)?.value)
    }
  }, [field.options])

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
                      icon={
                        field.options.find(l => l.value === item)?.icon ?? ''
                      }
                      style={{
                        color: field.options.find(l => l.value === item)?.color
                      }}
                    />
                    <span className="-mt-px block truncate">
                      {field.options.find(l => l.value === item)?.text ??
                        'None'}
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
              field.options.find(l => l.value === value)?.icon ??
              field.nullOption
            ) && (
              <Icon
                className="size-5"
                icon={
                  field.options.find(l => l.value === value)?.icon ??
                  field.nullOption ??
                  ''
                }
                style={{
                  color: field.options.find(l => l.value === value)?.color
                }}
              />
            )}
            {field.options.length &&
              field.options[0].icon === undefined &&
              field.options[0].color !== undefined && (
                <span
                  className="size-2 rounded-full"
                  style={{
                    backgroundColor: field.options.find(l => l.value === value)
                      ?.color
                  }}
                />
              )}
            <span className="-mt-px block truncate">
              {field.options.find(l => l.value === value)?.text ?? 'None'}
            </span>
          </>
        )
      }
      disabled={field.disabled}
      icon={field.icon}
      label={field.label}
      multiple={!!field.multiple}
      namespace={namespace}
      required={field.required}
      setValue={handleChange}
      value={value}
    >
      {field.nullOption !== undefined && (
        <ListboxNullOption
          hasBgColor={field.options[0]?.color !== undefined}
          icon={field.nullOption}
        />
      )}
      {field.options.map(({ text, color, icon, value: v }) => (
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
