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
      <ModalWrapper isOpen={isOpen} minWidth="50vw" modalRef={modalRef}>
        <ModalHeader
          actionButtonIcon={actionButtonIcon}
          actionButtonIsRed={actionButtonIsRed}
          icon={icon}
          namespace={namespace}
          title={title}
          onActionButtonClick={onActionButtonClick}
          onClose={onClose}
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
                        darker
                        disabled={field.disabled}
                        icon={field.icon}
                        name={field.label}
                        namespace={namespace}
                        placeholder={field.placeholder}
                        setValue={value => {
                          setData({ [field.id]: value })
                        }}
                        value={selectedData as string}
                      />
                    )
                  case 'date':
                    return (
                      <DateInput
                        key={field.id}
                        darker
                        date={selectedData as string}
                        icon={field.icon}
                        index={field.index}
                        modalRef={field.modalRef}
                        name={field.label}
                        namespace={namespace}
                        setDate={(date: string) => {
                          setData({ [field.id]: date })
                        }}
                      />
                    )
                  case 'listbox':
                    return (
                      <ListboxOrComboboxInput
                        key={field.id}
                        buttonContent={
                          field.multiple === true &&
                          Array.isArray(selectedData) ? (
                            <>
                              {selectedData.length > 0 ? (
                                selectedData.map((item, i) => (
                                  <>
                                    <Icon
                                      key={item}
                                      className="size-5"
                                      icon={
                                        field.options.find(
                                          l => l.value === item
                                        )?.icon ?? ''
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
                                    <Icon
                                      className="size-5"
                                      icon={field.nullOption}
                                    />
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
                        icon={field.icon}
                        multiple={field.multiple}
                        name={field.label}
                        namespace={namespace}
                        setValue={(value: string | string[]) => {
                          setData({ [field.id]: value })
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
                        key={field.id}
                        color={selectedData as string}
                        name={field.label}
                        namespace={namespace}
                        setColorPickerOpen={() => {
                          setColorPickerOpen(field.id)
                        }}
                        setColor={value => {
                          setData({ [field.id]: value })
                        }}
                      />
                    )
                  case 'icon':
                    return (
                      <IconInput
                        key={field.id}
                        icon={selectedData as string}
                        name={field.label}
                        namespace={namespace}
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
                        onImageRemoved={() => {
                          setData({
                            [field.id]: {
                              image: null,
                              preview: null
                            }
                          })
                        }}
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
                type={openType as 'create' | 'update'}
                onClick={() => {
                  onSubmitButtonClick().catch(console.error)
                }}
              />
            ) : (
              <Button
                className="mt-4"
                icon={submitButtonIcon ?? ''}
                iconAtEnd={submitButtonIconAtEnd}
                loading={submitLoading}
                onClick={() => {
                  onSubmitButtonClick().catch(console.error)
                }}
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
          color={(data[colorPickerOpen ?? ''] as string) ?? '#FFFFFF'}
          isOpen={colorPickerOpen !== null}
          setColor={value => {
            setData({
              [colorPickerOpen ?? '']: value
            })
          }}
          setOpen={() => {
            setColorPickerOpen(null)
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
          enablePixaBay
          enableUrl
          acceptedMimeTypes={{
            images: ['image/png', 'image/jpeg', 'image/webp']
          }}
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
        />
      )}
    </>
  )
}

export default Modal
