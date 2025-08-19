import { QRCodeScanner, TextInput } from '@components/inputs'
import { useModalStore } from '@components/modals/core/useModalStore'
import {
  type FormInputProps,
  type TextFieldProps
} from '@components/modals/features/FormModal/typescript/form_interfaces'

function FormTextInput({
  field,
  value,
  autoFocus,
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
        actionButtonProps={
          field.actionButtonProps
            ? field.actionButtonProps
            : field.qrScanner
              ? {
                  icon: 'tabler:qrcode',
                  onClick: openQRScanner
                }
              : undefined
        }
        autoFocus={autoFocus}
        disabled={field.disabled}
        errorMsg={field.errorMsg}
        icon={field.icon}
        isPassword={field.isPassword}
        label={field.label}
        namespace={namespace}
        placeholder={field.placeholder}
        required={field.required}
        setValue={handleChange}
        value={value}
      />
    </>
  )
}

export default FormTextInput
