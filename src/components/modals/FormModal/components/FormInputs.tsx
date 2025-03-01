import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import {
  TextInput,
  DateInput,
  ListboxOrComboboxInput,
  ListboxNullOption,
  ListboxOrComboboxOption,
  ColorInput,
  IconInput,
  ImageAndFileInput
} from '@components/inputs'
import { IFieldProps } from '@interfaces/modal_interfaces'

function FormInputs<T>({
  fields,
  data,
  setData,
  namespace,
  setColorPickerOpen,
  setIconSelectorOpen,
  setImagePickerModalOpen
}: {
  fields: IFieldProps<T>[]
  data: T
  setData: React.Dispatch<React.SetStateAction<T>>
  namespace: string
  setColorPickerOpen: (id: string) => void
  setIconSelectorOpen: (id: string) => void
  setImagePickerModalOpen: (id: string) => void
}): React.ReactElement {
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
                disabled={field.disabled}
                icon={field.icon}
                isPassword={field.isPassword}
                name={field.label}
                namespace={namespace}
                placeholder={field.placeholder}
                setValue={value => {
                  setData(prev => ({ ...prev, [field.id]: value }))
                }}
                value={selectedData as string}
              />
            )
          case 'date':
            return (
              <DateInput
                key={field.id as string}
                darker
                date={selectedData as string}
                icon={field.icon}
                index={field.index}
                modalRef={field.modalRef}
                name={field.label}
                namespace={namespace}
                setDate={(date: string) => {
                  setData(prev => ({ ...prev, [field.id]: date }))
                }}
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
                setValue={(value: string | string[]) => {
                  setData(prev => ({ ...prev, [field.id]: value }))
                }}
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
                setColor={value => {
                  setData(prev => ({ ...prev, [field.id]: value }))
                }}
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
                setIcon={value => {
                  setData(prev => ({ ...prev, [field.id]: value }))
                }}
                setIconSelectorOpen={() => {
                  setIconSelectorOpen(field.id as string)
                }}
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
                setImage={value => {
                  setData(prev => ({
                    ...prev,
                    [field.id]: {
                      ...(selectedData as {
                        image: string | File | null
                        preview: string | null
                      }),
                      image: value
                    }
                  }))
                }}
                setImagePickerModalOpen={() => {
                  setImagePickerModalOpen(field.id as string)
                  field.onFileRemoved?.()
                }}
                setPreview={value => {
                  setData(prev => ({
                    ...prev,
                    [field.id]: {
                      ...(selectedData as {
                        image: string | File | null
                        preview: string | null
                      }),
                      preview: value
                    }
                  }))
                }}
                onImageRemoved={() => {
                  setData(prev => ({
                    ...prev,
                    [field.id]: {
                      image: null,
                      preview: null
                    }
                  }))
                }}
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
