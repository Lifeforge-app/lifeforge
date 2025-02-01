import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { Button, CreateOrModifyButton } from '@components/buttons'
import {
  DateInput,
  IconInput,
  IconPickerModal,
  ImageAndFileInput,
  ImagePickerModal,
  TextInput,
  ListboxOrComboboxInput,
  ListboxNullOption,
  ListboxOrComboboxOption,
  ColorInput,
  ColorPickerModal
} from '@components/inputs'
import LoadingScreen from '@components/screens/LoadingScreen'
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
  isOpen,
  openType,
  onClose,
  submitButtonLabel,
  submitButtonIcon,
  submitButtonIconAtEnd,
  onSubmit,
  loading = false,
  actionButtonIcon,
  actionButtonIsRed,
  onActionButtonClick,
  namespace
}: {
  modalRef?: React.RefObject<HTMLDivElement | null>
  fields: IFieldProps[]
  data: Record<
    string,
    | string
    | string[]
    | {
        image: string | File | null
        preview: string | null
      }
  >
  setData: (
    data: Record<
      string,
      | string
      | string[]
      | {
          image: string | File | null
          preview: string | null
        }
    >
  ) => void
  title: string
  icon: string
  isOpen: boolean
  openType?: 'create' | 'update' | null
  onClose: () => void
  submitButtonLabel?: string
  submitButtonIcon?: string
  submitButtonIconAtEnd?: boolean
  onSubmit: () => Promise<void>
  loading?: boolean
  actionButtonIcon?: string
  actionButtonIsRed?: boolean
  onActionButtonClick?: () => void
  namespace: string
}): React.ReactElement {
  const [colorPickerOpen, setColorPickerOpen] = useState<string | null>(null)
  const [iconSelectorOpen, setIconSelectorOpen] = useState<string | null>(null)
  const [imagePickerModalOpen, setImagePickerModalOpen] = useState<
    string | null
  >(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  async function onSubmitButtonClick(): Promise<void> {
    setSubmitLoading(true)
    await onSubmit()
    setSubmitLoading(false)
  }

  return (
    <>
      <ModalWrapper minWidth="50vw" modalRef={modalRef} isOpen={isOpen}>
        <ModalHeader
          title={title}
          icon={icon}
          onClose={onClose}
          actionButtonIcon={actionButtonIcon}
          actionButtonIsRed={actionButtonIsRed}
          onActionButtonClick={onActionButtonClick}
          namespace={namespace}
        />
        {!loading ? (
          <>
            <div className="space-y-4">
              {fields.map(field => {
                const selectedData = data[field.id]

                switch (field.type) {
                  case 'text':
                    return (
                      <TextInput
                        key={field.id}
                        name={field.label}
                        icon={field.icon}
                        value={selectedData as string}
                        updateValue={value => {
                          setData({ [field.id]: value })
                        }}
                        darker
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                        namespace={namespace}
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
                        name={field.label}
                        icon={field.icon}
                        darker
                        namespace={namespace}
                      />
                    )
                  case 'listbox':
                    return (
                      <ListboxOrComboboxInput
                        type="listbox"
                        key={field.id}
                        name={field.label}
                        icon={field.icon}
                        value={selectedData}
                        setValue={(value: string | string[]) => {
                          setData({ [field.id]: value })
                        }}
                        multiple={field.multiple}
                        buttonContent={
                          field.multiple === true &&
                          Array.isArray(selectedData) ? (
                            <>
                              {selectedData.length > 0 ? (
                                selectedData.map((item, i) => (
                                  <>
                                    <Icon
                                      key={item}
                                      icon={
                                        field.options.find(
                                          l => l.value === item
                                        )?.icon ?? ''
                                      }
                                      className="size-5"
                                    />
                                    <span className="-mt-px block truncate">
                                      {field.options.find(l => l.value === item)
                                        ?.text ?? 'None'}
                                    </span>
                                    {i !== selectedData.length - 1 && (
                                      <Icon
                                        icon="tabler:circle-filled"
                                        className="size-1"
                                      />
                                    )}
                                  </>
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
                                  field.options.find(
                                    l => l.value === selectedData
                                  )?.icon ??
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
                                {field.options.find(
                                  l => l.value === selectedData
                                )?.text ?? 'None'}
                              </span>
                            </>
                          )
                        }
                        namespace={namespace}
                      >
                        {field.nullOption !== undefined && (
                          <ListboxNullOption
                            icon={field.nullOption}
                            hasBgColor={field.options[0]?.color !== undefined}
                          />
                        )}
                        {field.options.map(({ text, color, icon, value }) => (
                          <ListboxOrComboboxOption
                            key={value}
                            value={value}
                            text={text}
                            icon={icon}
                            color={color}
                          />
                        ))}
                      </ListboxOrComboboxInput>
                    )
                  case 'color':
                    return (
                      <ColorInput
                        key={field.id}
                        name={field.label}
                        color={selectedData as string}
                        updateColor={value => {
                          setData({ [field.id]: value })
                        }}
                        setColorPickerOpen={() => {
                          setColorPickerOpen(field.id)
                        }}
                        namespace={namespace}
                      />
                    )
                  case 'icon':
                    return (
                      <IconInput
                        namespace={namespace}
                        key={field.id}
                        name={field.label}
                        icon={selectedData as string}
                        setIcon={value => {
                          setData({ [field.id]: value })
                        }}
                        setIconSelectorOpen={() => {
                          setIconSelectorOpen(field.id)
                        }}
                      />
                    )
                  case 'file':
                    return (
                      <ImageAndFileInput
                        icon="tabler:file"
                        name={field.label}
                        preview={
                          (
                            selectedData as {
                              image: string | File | null
                              preview: string | null
                            }
                          ).preview
                        }
                        image={
                          (
                            selectedData as {
                              image: string | File | null
                              preview: string | null
                            }
                          ).image
                        }
                        setPreview={value => {
                          setData({
                            [field.id]: {
                              ...(selectedData as {
                                image: string | File | null
                                preview: string | null
                              }),
                              preview: value
                            }
                          })
                        }}
                        setImage={value => {
                          setData({
                            [field.id]: {
                              ...(selectedData as {
                                image: string | File | null
                                preview: string | null
                              }),
                              image: value
                            }
                          })
                        }}
                        setImagePickerModalOpen={() => {
                          setImagePickerModalOpen(field.id)
                          field.onFileRemoved?.()
                        }}
                        onImageRemoved={() => {
                          setData({
                            [field.id]: {
                              image: null,
                              preview: null
                            }
                          })
                        }}
                        namespace={namespace}
                      />
                    )
                  default:
                    return <></>
                }
              })}
            </div>
            {['create', 'update'].includes(openType ?? '') ? (
              <CreateOrModifyButton
                loading={submitLoading}
                onClick={() => {
                  onSubmitButtonClick().catch(console.error)
                }}
                type={openType as 'create' | 'update'}
              />
            ) : (
              <Button
                loading={submitLoading}
                className="mt-4"
                onClick={() => {
                  onSubmitButtonClick().catch(console.error)
                }}
                icon={submitButtonIcon ?? ''}
                iconAtEnd={submitButtonIconAtEnd}
              >
                {submitButtonLabel}
              </Button>
            )}
          </>
        ) : (
          <LoadingScreen />
        )}
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
        <IconPickerModal
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
      {fields.some(f => f.type === 'file') && (
        <ImagePickerModal
          isOpen={imagePickerModalOpen !== null}
          onClose={() => {
            setImagePickerModalOpen(null)
          }}
          onSelect={async (file, preview) => {
            setData({
              [imagePickerModalOpen ?? '']: {
                image: file,
                preview
              }
            })
          }}
          acceptedMimeTypes={{
            images: ['image/png', 'image/jpeg', 'image/webp']
          }}
          enableUrl
          enablePixaBay
        />
      )}
    </>
  )
}

export default Modal
