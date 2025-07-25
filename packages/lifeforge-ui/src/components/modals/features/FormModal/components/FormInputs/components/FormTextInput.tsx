import { QRCodeScanner, TextInput } from '@components/inputs'
import {
  ITextInputFieldProps,
  InferFormInputProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'
import { useState } from 'react'

function FormTextInput({
  field,
  selectedData,
  namespace,
  handleChange
}: InferFormInputProps<ITextInputFieldProps>) {
  const [qrScannerModalOpen, setQrScannerModalOpen] = useState<boolean>(false)

  return (
    <>
      <TextInput
        darker
        actionButtonIcon={field.qrScanner ? 'tabler:qrcode' : ''}
        disabled={field.disabled}
        icon={field.icon}
        isPassword={field.isPassword}
        name={field.label}
        namespace={namespace}
        placeholder={field.placeholder}
        required={field.required}
        setValue={handleChange}
        value={selectedData}
        onActionButtonClick={() => {
          setQrScannerModalOpen(true)
        }}
      />
      <QRCodeScanner
        isOpen={qrScannerModalOpen}
        onClose={() => {
          setQrScannerModalOpen(false)
        }}
        onScanned={data => {
          handleChange(data)
          setQrScannerModalOpen(false)
        }}
      />
    </>
  )
}

export default FormTextInput
