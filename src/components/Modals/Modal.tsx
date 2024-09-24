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
  data: Record<string, string>
  setData: (data: Record<string, string>) => void
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
          switch (field.type) {
            case 'text':
              return (
                <Input
                  key={field.id}
                  name={field.name}
                  icon={field.icon}
                  value={data[field.id]}
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
                  date={data[field.id]}
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
                  value={data[field.id]}
                  setValue={(value: string) => {
                    setData({ [field.id]: value })
                  }}
                  buttonContent={
                    <>
                      <Icon
                        icon={
                          field.options.find(l => l.value === data[field.id])
                            ?.icon ??
                          field.nullOption ??
                          ''
                        }
                        style={{
                          color: field.options.find(
                            l => l.value === data[field.id]
                          )?.color
                        }}
                        className="size-5"
                      />
                      <span className="-mt-px block truncate">
                        {field.options.find(l => l.value === data[field.id])
                          ?.text ?? 'None'}
                      </span>
                    </>
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
                  color={data[field.id]}
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
                    icon={data[field.id]}
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
          color={data[colorPickerOpen ?? ''] ?? '#FFFFFF'}
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
