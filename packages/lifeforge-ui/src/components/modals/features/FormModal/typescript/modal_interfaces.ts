/* eslint-disable @typescript-eslint/no-explicit-any */

export type Location = {
  name: string
  formattedAddress: string
  location: {
    latitude: number
    longitude: number
  }
}

export type IFileData = {
  image: string | File | null
  preview: string | null
}

type ITextInputFieldProps = {
  label: string
  icon: string
  type: 'text'
  isPassword?: boolean
  placeholder: string
  qrScanner?: boolean
}

type INumberInputFieldProps = {
  label: string
  icon: string
  type: 'number'
  placeholder: string
}

type ICurrencyInputFieldProps = {
  label: string
  icon: string
  type: 'currency'
}

type ITextAreaInputFieldProps = {
  label: string
  icon: string
  type: 'textarea'
  placeholder: string
}

type IDateInputFieldProps = {
  label: string
  icon: string
  type: 'datetime'
  hasTime?: boolean
}

type IListboxInputFieldProps = {
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

type IColorInputFieldProps = {
  label: string
  type: 'color'
}

type IIconInputFieldProps = {
  label: string
  type: 'icon'
}

type IImageAndFileInputFieldProps = {
  label: string
  type: 'file'
  onFileRemoved?: () => void
  enableAIImageGeneration?: boolean
  defaultImageGenerationPrompt?: string
}

type ILocationInputFieldProps = {
  label: string
  type: 'location'
}

type IFormCheckboxFieldProps = {
  label: string
  icon: string
  type: 'checkbox'
}

type BaseFieldProps<U extends PropertyKey> = {
  id: U
  hidden?: boolean
  required?: boolean
  disabled?: boolean
}

type FieldTypeMap = {
  string:
    | ITextInputFieldProps
    | ITextAreaInputFieldProps
    | IColorInputFieldProps
    | IIconInputFieldProps
    | IListboxInputFieldProps
  location: ILocationInputFieldProps
  number: INumberInputFieldProps | ICurrencyInputFieldProps
  boolean: IFormCheckboxFieldProps
  Date: IDateInputFieldProps
  file: IImageAndFileInputFieldProps
  'string[]': IListboxInputFieldProps
  'any[]': IListboxInputFieldProps
}

type GetTypeKey<T> = T extends string
  ? 'string'
  : T extends Location
    ? 'location'
    : T extends number
      ? 'number'
      : T extends boolean
        ? 'boolean'
        : T extends Date
          ? 'Date'
          : T extends IFileData
            ? 'file'
            : T extends string[]
              ? 'string[]'
              : T extends any[]
                ? 'any[]'
                : never

type IFieldProps<T = any, U extends keyof T = keyof T> = U extends keyof T
  ? GetTypeKey<T[U]> extends keyof FieldTypeMap
    ? BaseFieldProps<U> & FieldTypeMap[GetTypeKey<T[U]>]
    : BaseFieldProps<U> &
        (
          | ITextInputFieldProps
          | INumberInputFieldProps
          | ICurrencyInputFieldProps
          | ITextAreaInputFieldProps
          | IDateInputFieldProps
          | IListboxInputFieldProps
          | IColorInputFieldProps
          | IIconInputFieldProps
          | IImageAndFileInputFieldProps
          | ILocationInputFieldProps
          | IFormCheckboxFieldProps
        )
  : never

type IFormState = Record<string, any>

export type {
  IFieldProps,
  IFormState,
  ITextInputFieldProps,
  INumberInputFieldProps,
  ICurrencyInputFieldProps,
  ITextAreaInputFieldProps,
  IDateInputFieldProps,
  IListboxInputFieldProps,
  IColorInputFieldProps,
  IIconInputFieldProps,
  IImageAndFileInputFieldProps,
  ILocationInputFieldProps,
  IFormCheckboxFieldProps
}
