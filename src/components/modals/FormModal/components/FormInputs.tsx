import { Icon } from '@iconify/react'
import React from 'react'
import {
  TextInput,
  DateInput,
  ListboxOrComboboxInput,
  ListboxNullOption,
  ListboxOrComboboxOption,
  ColorInput,
  IconInput,
  ImageAndFileInput,
  LocationInput
} from '@components/inputs'
import { IFieldProps } from '@interfaces/modal_interfaces'

function FormInputs<T>({
  fields,
  data,
  setData,
  namespace,
  setColorPickerOpen,
  setIconSelectorOpen,
  setImagePickerModalOpen,
  setQrScannerModalOpen
}: {
  fields: IFieldProps<T>[]
  data: T
  setData: React.Dispatch<React.SetStateAction<T>>
  namespace: string
  setColorPickerOpen: (id: string) => void
  setIconSelectorOpen: (id: string) => void
  setImagePickerModalOpen: (id: string) => void
  setQrScannerModalOpen: (id: string) => void
}): React.ReactElement {
  const handleChange = (field: IFieldProps<T>) => {
    return (
      value:
        | string
        | string[]
        | {
            image: string | File | null
            preview: string | null
          }
    ) => {
      setData(prev => ({ ...prev, [field.id]: value }))
    }
  }

  return (
    <div className="space-y-4">
      {fields.map(field => {
        const selectedData = data[field.id]

        switch (field.type) {
          case 'text':
            return (
              <TextInput
                key={field.id as string}
                darker
                actionButtonIcon={field.qrScanner ? 'tabler:qrcode' : ''}
                disabled={field.disabled}
                icon={field.icon}
                isPassword={field.isPassword}
                name={field.label}
                namespace={namespace}
                placeholder={field.placeholder}
                setValue={handleChange(field)}
                value={selectedData as string}
                onActionButtonClick={() => {
                  setQrScannerModalOpen(field.id as string)
                }}
              />
            )
          case 'datetime':
            return (
              <DateInput
                key={field.id as string}
                darker
                date={selectedData as string}
                hasTime={field.hasTime}
                icon={field.icon}
                index={field.index}
                modalRef={field.modalRef}
                name={field.label}
                namespace={namespace}
                setDate={handleChange(field)}
              />
            )
          case 'listbox':
            return (
              <ListboxOrComboboxInput
                key={field.id as string}
                buttonContent={
                  field.multiple === true && Array.isArray(selectedData) ? (
                    <>
                      {selectedData.length > 0 ? (
                        selectedData.map((item: string, i: number) => (
                          <>
                            <Icon
                              key={item}
                              className="size-5"
                              icon={
                                field.options.find(l => l.value === item)
                                  ?.icon ?? ''
                              }
                            />
                            <span className="-mt-px block truncate">
                              {field.options.find(l => l.value === item)
                                ?.text ?? 'None'}
                            </span>
                            {i !== selectedData.length - 1 && (
                              <Icon
                                className="size-1"
                                icon="tabler:circle-filled"
                              />
                            )}
                          </>
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
                      <Icon
                        className="size-5"
                        icon={
                          field.options.find(l => l.value === selectedData)
                            ?.icon ??
                          field.nullOption ??
                          ''
                        }
                        style={{
                          color: field.options.find(
                            l => l.value === selectedData
                          )?.color
                        }}
                      />
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
                        {field.options.find(l => l.value === selectedData)
                          ?.text ?? 'None'}
                      </span>
                    </>
                  )
                }
                icon={field.icon}
                multiple={field.multiple}
                name={field.label}
                namespace={namespace}
                setValue={handleChange(field)}
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
          case 'color':
            return (
              <ColorInput
                key={field.id as string}
                color={selectedData as string}
                name={field.label}
                namespace={namespace}
                setColor={handleChange(field)}
                setColorPickerOpen={() => {
                  setColorPickerOpen(field.id as string)
                }}
              />
            )
          case 'icon':
            return (
              <IconInput
                key={field.id as string}
                icon={selectedData as string}
                name={field.label}
                namespace={namespace}
                setIcon={handleChange(field)}
                setIconSelectorOpen={() => {
                  setIconSelectorOpen(field.id as string)
                }}
              />
            )

          case 'location':
            return (
              <LocationInput
                key={field.id as string}
                label={field.label}
                location={selectedData as string}
                namespace={namespace}
                setLocation={value => handleChange(field)(value ?? '')}
              />
            )
          case 'file':
            return (
              <ImageAndFileInput
                icon="tabler:file"
                image={
                  (
                    selectedData as {
                      image: string | File | null
                      preview: string | null
                    }
                  ).image
                }
                name={field.label}
                namespace={namespace}
                preview={
                  (
                    selectedData as {
                      image: string | File | null
                      preview: string | null
                    }
                  ).preview
                }
                setImage={value =>
                  handleChange(field)({
                    ...(selectedData as {
                      image: string | File | null
                      preview: string | null
                    }),
                    image: value
                  })
                }
                setImagePickerModalOpen={() => {
                  setImagePickerModalOpen(field.id as string)
                  field.onFileRemoved?.()
                }}
                setPreview={value =>
                  handleChange(field)({
                    ...(selectedData as {
                      image: string | File | null
                      preview: string | null
                    }),
                    preview: value
                  })
                }
                onImageRemoved={() =>
                  handleChange(field)({
                    image: null,
                    preview: null
                  })
                }
              />
            )
          default:
            return <></>
        }
      })}
    </div>
  )
}

export default FormInputs
