import { QRCodeScanner, TextInput } from '@components/inputs'
import { useModalStore } from '@components/overlays'

import type {
  BaseFieldProps,
  FormInputProps
} from '../../../typescript/form.types'

export type TextFieldProps = BaseFieldProps<string, string, true> & {
  type: 'text'
  icon: string
  isPassword?: boolean
  placeholder: string
  qrScanner?: boolean
  actionButtonProps?: React.ComponentProps<
    typeof TextInput
  >['actionButtonProps']
}

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
        value={value}
        onChange={handleChange}
      />
    </>
  )
}

export default FormTextInput
