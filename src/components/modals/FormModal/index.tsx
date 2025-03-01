import React, { useState } from 'react'
import LoadingScreen from '@components/screens/LoadingScreen'
import { type IFieldProps } from '@interfaces/modal_interfaces'
import FormInputs from './components/FormInputs'
import PickerModals from './components/PickerModals'
import SubmitButton from './components/SubmitButton'
import ModalHeader from '../ModalHeader'
import ModalWrapper from '../ModalWrapper'

function FormModal<T extends Record<string, any | any[]>>({
  fields,
  data,
  setData,

  title,
  icon,
  isOpen,
  openType,
  onClose,
  loading = false,

  onSubmit,
  submitButtonLabel,
  submitButtonIcon,
  submitButtonIconAtEnd,

  actionButtonIcon,
  actionButtonIsRed,
  onActionButtonClick,

  namespace,
  modalRef
}: {
  modalRef?: React.RefObject<HTMLDivElement | null>
  fields: IFieldProps<T>[]
  data: T
  setData: React.Dispatch<React.SetStateAction<T>>
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
            <FormInputs
              data={data}
              fields={fields}
              namespace={namespace}
              setColorPickerOpen={setColorPickerOpen}
              setData={setData}
              setIconSelectorOpen={setIconSelectorOpen}
              setImagePickerModalOpen={setImagePickerModalOpen}
            />
            <SubmitButton
              openType={openType}
              submitButtonIcon={submitButtonIcon}
              submitButtonIconAtEnd={submitButtonIconAtEnd}
              submitButtonLabel={submitButtonLabel ?? 'Submit'}
              submitLoading={submitLoading}
              onSubmitButtonClick={onSubmitButtonClick}
            />
          </>
        ) : (
          <LoadingScreen />
        )}
      </ModalWrapper>
      <PickerModals
        colorPickerOpen={colorPickerOpen}
        data={data}
        fields={fields}
        iconSelectorOpen={iconSelectorOpen}
        imagePickerModalOpen={imagePickerModalOpen}
        setColorPickerOpen={setColorPickerOpen}
        setData={setData}
        setIconSelectorOpen={setIconSelectorOpen}
        setImagePickerModalOpen={setImagePickerModalOpen}
      />
    </>
  )
}

export default FormModal
