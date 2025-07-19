/* eslint-disable @typescript-eslint/no-explicit-any */
interface ITextInputFieldProps {
  label: string
  icon: string
  type: 'text'
  isPassword?: boolean
  placeholder: string
  qrScanner?: boolean
}

interface INumberInputFieldProps {
  label: string
  icon: string
  type: 'number'
  placeholder: string
}

interface ITextAreaInputFieldProps {
  label: string
  icon: string
  type: 'textarea'
  placeholder: string
}

interface IDateInputFieldProps {
  label: string
  icon: string
  type: 'datetime'
  hasTime?: boolean
}

interface IListboxInputFieldProps {
  label: string
  icon: string
  type: 'listbox'
  options: Array<{
    value: string
    text: string
    icon?: string
    color?: string
  }>
  nullOption?: string
  multiple?: boolean
}

interface IColorInputFieldProps {
  label: string
  type: 'color'
}

interface IIconInputFieldProps {
  label: string
  type: 'icon'
}

interface IImageAndFileInputFieldProps {
  label: string
  type: 'file'
  onFileRemoved?: () => void
  enableAIImageGeneration?: boolean
  defaultImageGenerationPrompt?: string
}

interface ILocationInputFieldProps {
  label: string
  type: 'location'
}

interface IFormCheckboxFieldProps {
  label: string
  icon: string
  type: 'checkbox'
}

type IFieldProps<T> = (
  | ITextInputFieldProps
  | INumberInputFieldProps
  | ITextAreaInputFieldProps
  | IDateInputFieldProps
  | IListboxInputFieldProps
  | IColorInputFieldProps
  | IIconInputFieldProps
  | IImageAndFileInputFieldProps
  | ILocationInputFieldProps
  | IFormCheckboxFieldProps
) & {
  id: keyof T
  hidden?: boolean
  required?: boolean
  disabled?: boolean
}

type IFormState = Record<string, any>

export type {
  IFieldProps,
  IFormState,
  ITextInputFieldProps,
  INumberInputFieldProps,
  ITextAreaInputFieldProps,
  IDateInputFieldProps,
  IListboxInputFieldProps,
  IColorInputFieldProps,
  IIconInputFieldProps,
  IImageAndFileInputFieldProps,
  ILocationInputFieldProps,
  IFormCheckboxFieldProps
}
