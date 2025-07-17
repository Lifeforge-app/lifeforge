import { useState } from 'react'

import { IFieldProps, ITextInputFieldProps } from '@interfaces/modal_interfaces'

import { QRCodeScanner, TextInput } from '@components/inputs'

interface FormTextInputProps<T> {
  field: IFieldProps<T> & ITextInputFieldProps
  selectedData: string
  namespace: string
  handleChange: (value: string) => void
}

function FormTextInput<T>({
  field,
  selectedData,
  namespace,
  handleChange
}: FormTextInputProps<T>) {
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
