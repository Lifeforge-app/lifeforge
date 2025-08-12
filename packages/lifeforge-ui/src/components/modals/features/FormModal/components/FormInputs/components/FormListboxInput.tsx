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
  selectedData,
  namespace,
  handleChange
}: FormInputProps<ListboxFieldProps>) {
  useEffect(() => {
    if (field.multiple) {
      handleChange(
        selectedData.map(
          (item: { value: string }) =>
            field.options.find(option => option.value === item)?.value
        )
      )
    } else {
      handleChange(
        field.options.find(option => option.value === selectedData)?.value
      )
    }
  }, [field.options])

  return (
    <ListboxInput
      buttonContent={
        field.multiple === true && Array.isArray(selectedData) ? (
          <div className="flex flex-wrap items-center gap-3">
            {selectedData.length > 0 ? (
              selectedData.map((item: string, i: number) => (
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
          </div>
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
      label={field.label}
      multiple={!!field.multiple}
      namespace={namespace}
      required={field.required}
      setValue={handleChange}
      value={selectedData}
    >
      {field.nullOption !== undefined && (
        <ListboxNullOption
          hasBgColor={field.options[0]?.color !== undefined}
          icon={field.nullOption}
        />
      )}
      {field.options.map(({ text, color, icon, value }) => (
        <ListboxOption
          key={value}
          color={color}
          icon={icon}
          selected={JSON.stringify(selectedData) === JSON.stringify(value)}
          text={text}
          value={value}
        />
      ))}
    </ListboxInput>
  )
}

export default FormListboxInput
