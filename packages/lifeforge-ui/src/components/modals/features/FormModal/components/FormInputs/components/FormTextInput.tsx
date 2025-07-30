import { QRCodeScanner, TextInput } from '@components/inputs'
import { useModalStore } from '@components/modals/core/useModalStore'
import {
  type FormInputProps,
  type TextFieldProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'

function FormTextInput({
  field,
  selectedData,
  namespace,
  handleChange
}: FormInputProps<TextFieldProps>) {
  const open = useModalStore(state => state.open)

  const openQRScanner = () => {
    open(QRCodeScanner, {
      onScanned: data => {
        handleChange(data)
      }
    })
  }

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
        onActionButtonClick={openQRScanner}
      />
    </>
  )
}

export default FormTextInput
