import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController
} from 'react-hook-form'

import {
  QRCodeScanner,
  TextInput,
  type TextInputProps
} from '@/components/inputs'
import { useModalStore } from '@/providers'

import { useNamespace } from '../FormModal'

type TextFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPathByValue<TFieldValues, string | null | undefined>
  qrScanner?: boolean
} & Omit<TextInputProps, 'value' | 'onChange'>

export function TextField<TFieldValues extends FieldValues>({
  control,
  name,
  qrScanner = false,
  actionButtonProps,
  namespace,
  ...rest
}: TextFieldProps<TFieldValues>) {
  const { open } = useModalStore()
  const { field, fieldState } = useController({
    control,
    name
  })
  const contextNamespace = useNamespace()

  const activeNamespace = namespace ?? contextNamespace

  function handleQRScanned(data: string) {
    field.onChange(data)
  }

  function openQRScanner() {
    open(QRCodeScanner, {
      onScanned: handleQRScanned
    })
  }

  const computedActionButtonProps = actionButtonProps
    ? actionButtonProps
    : qrScanner
      ? {
          icon: 'tabler:qrcode',
          onClick: openQRScanner
        }
      : undefined

  const textInputProps = {
    ...rest,
    actionButtonProps: computedActionButtonProps,
    errorMsg: fieldState.error?.message,
    namespace: activeNamespace,
    value: field.value ?? '',
    onChange: field.onChange
  } as TextInputProps

  return <TextInput {...textInputProps} />
}
