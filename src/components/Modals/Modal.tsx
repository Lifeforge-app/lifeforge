import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import ColorInput from '@components/ButtonsAndInputs/ColorPicker/ColorInput'
import ColorPickerModal from '@components/ButtonsAndInputs/ColorPicker/ColorPickerModal'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import DateInput from '@components/ButtonsAndInputs/DateInput'
import IconInput from '@components/ButtonsAndInputs/IconSelector/IconInput'
import IconPicker from '@components/ButtonsAndInputs/IconSelector/IconPicker'
import Input from '@components/ButtonsAndInputs/Input'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'
import ListboxNullOption from '@components/ButtonsAndInputs/ListboxInput/components/ListboxNullOption'
import ListboxOption from '@components/ButtonsAndInputs/ListboxInput/components/ListboxOption'
import { type IFieldProps } from '@interfaces/modal_interfaces'
import ModalHeader from './ModalHeader'
import ModalWrapper from './ModalWrapper'

function Modal({
  modalRef,
  fields,
  data,
  setData,
  title,
  icon,
  openType,
  setOpenType,
  onSubmit
}: {
  modalRef?: React.RefObject<HTMLDivElement | null>
  fields: IFieldProps[]
  data: Record<string, string | string[]>
  setData: (data: Record<string, string | string[]>) => void
  title: string
  icon: string
  openType: string | null
  setOpenType: (type: 'create' | 'update' | null) => void
  onSubmit: () => Promise<void>
}): React.ReactElement {
  const [colorPickerOpen, setColorPickerOpen] = useState<string | null>(null)
  const [iconSelectorOpen, setIconSelectorOpen] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmitButtonClick(): Promise<void> {
    setLoading(true)
    await onSubmit()
    setLoading(false)
  }

  return (
    <>
      <ModalWrapper
        minWidth="50vw"
        modalRef={modalRef}
        isOpen={openType !== null}
      >
        <ModalHeader
          title={title}
          icon={icon}
          onClose={() => {
            setOpenType(null)
          }}
        />
        {fields.map(field => {
          const selectedData = data[field.id]

          switch (field.type) {
            case 'text':
              return (
                <Input
                  key={field.id}
                  name={field.name}
                  icon={field.icon}
                  value={selectedData as string}
                  updateValue={value => {
                    setData({ [field.id]: value })
                  }}
                  darker
                  placeholder={field.placeholder}
                />
              )
            case 'date':
              return (
                <DateInput
                  key={field.id}
                  modalRef={field.modalRef}
                  index={field.index}
                  date={selectedData as string}
                  setDate={(date: string) => {
                    setData({ [field.id]: date })
                  }}
                  name={field.name}
                  icon={field.icon}
                  darker
                />
              )
            case 'listbox':
              return (
                <ListboxInput
                  key={field.id}
                  name={field.name}
                  icon={field.icon}
                  value={selectedData}
                  setValue={(value: string | string[]) => {
                    setData({ [field.id]: value })
                  }}
                  multiple={field.multiple}
                  buttonContent={
                    field.multiple === true && Array.isArray(selectedData) ? (
                      <>
                        {selectedData.length > 0 ? (
                          selectedData.map(item => (
                            <Icon
                              key={item}
                              icon={
                                field.options.find(l => l.value === item)
                                  ?.icon ?? ''
                              }
                              className="size-5"
                            />
                          ))
                        ) : (
                          <>
                            {field.nullOption !== undefined && (
                              <Icon
                                icon={field.nullOption}
                                className="size-5"
                              />
                            )}
                            None
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <Icon
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
                          className="size-5"
                        />
                        <span className="-mt-px block truncate">
                          {field.options.find(l => l.value === selectedData)
                            ?.text ?? 'None'}
                        </span>
                      </>
                    )
                  }
                >
                  {field.nullOption !== undefined && (
                    <ListboxNullOption
                      icon={field.nullOption}
                      hasBgColor={field.options[0].color !== undefined}
                    />
                  )}
                  {field.options.map(({ text, color, icon, value }) => (
                    <ListboxOption
                      key={value}
                      value={value}
                      text={text}
                      icon={icon}
                      color={color}
                    />
                  ))}
                </ListboxInput>
              )
            case 'color':
              return (
                <ColorInput
                  key={field.id}
                  name={field.name}
                  color={selectedData as string}
                  updateColor={value => {
                    setData({ [field.id]: value })
                  }}
                  setColorPickerOpen={() => {
                    setColorPickerOpen(field.id)
                  }}
                />
              )
            case 'icon':
              return (
                <>
                  <IconInput
                    key={field.id}
                    name={field.name}
                    icon={selectedData as string}
                    setIcon={value => {
                      setData({ [field.id]: value })
                    }}
                    setIconSelectorOpen={() => {
                      setIconSelectorOpen(field.id)
                    }}
                  />
                </>
              )
            default:
              return null
          }
        })}
        <CreateOrModifyButton
          loading={loading}
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
          type={openType as 'create' | 'update'}
        />
      </ModalWrapper>
      {fields.some(f => f.type === 'color') && (
        <ColorPickerModal
          isOpen={colorPickerOpen !== null}
          setOpen={() => {
            setColorPickerOpen(null)
          }}
          color={(data[colorPickerOpen ?? ''] as string) ?? '#FFFFFF'}
          setColor={value => {
            setData({
              [colorPickerOpen ?? '']: value
            })
          }}
        />
      )}

      {fields.some(f => f.type === 'icon') && (
        <IconPicker
          isOpen={iconSelectorOpen !== null}
          setOpen={() => {
            setIconSelectorOpen(null)
          }}
          setSelectedIcon={value => {
            setData({
              [iconSelectorOpen ?? '']: value
            })
          }}
        />
      )}
    </>
  )
}

export default Modal
