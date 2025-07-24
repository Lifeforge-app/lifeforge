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
  file: string | File | null
  preview: string | null
}

type ITextInputFieldProps = {
  type: 'text'
  icon: string
  isPassword?: boolean
  placeholder: string
  qrScanner?: boolean
  __formDataType: string
  __finalDataType: string
}

type INumberInputFieldProps = {
  type: 'number'
  icon: string
  placeholder: string
  __formDataType: number
  __finalDataType: number
}

type ICurrencyInputFieldProps = {
  type: 'currency'
  icon: string
  __formDataType: number
  __finalDataType: number
}

type ITextAreaInputFieldProps = {
  type: 'textarea'
  icon: string
  placeholder: string
  __formDataType: string
  __finalDataType: string
}

type IDateInputFieldProps = {
  type: 'datetime'
  icon: string
  hasTime?: boolean
  __formDataType: Date | null
  __finalDataType: string | null
}

type IListboxInputFieldProps = {
  type: 'listbox'
  icon: string
  options: Array<{
    value: string
    text: string
    icon?: string
    color?: string
  }>
  nullOption?: string
  multiple?: boolean
  __formDataType: string | string[] | any[]
  __finalDataType: string | string[] | any[]
}

type IColorInputFieldProps = {
  type: 'color'
  __formDataType: string
  __finalDataType: string
}

type IIconInputFieldProps = {
  type: 'icon'
  __formDataType: string
  __finalDataType: string
}

type IImageAndFileInputFieldProps = {
  type: 'file'
  onFileRemoved?: () => void
  enableAIImageGeneration?: boolean
  defaultImageGenerationPrompt?: string
  __formDataType: IFileData
  __finalDataType: IFileData['file']
}

type ILocationInputFieldProps = {
  type: 'location'
  __formDataType: Location | null
  __finalDataType: Location | null
}

type IFormCheckboxFieldProps = {
  type: 'checkbox'
  icon: string
  __formDataType: boolean
  __finalDataType: boolean
}

type BaseFieldProps = {
  label: string
  hidden?: boolean
  required?: boolean
  disabled?: boolean
}

type AllFields =
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

type IFormState = Record<string, any>

type MatchFieldByFormDataType<T> = Extract<AllFields, { __formDataType: T }>

type IFieldProps<
  TFormState extends Record<string, any>,
  TFormKey extends keyof TFormState = keyof TFormState
> = TFormKey extends keyof TFormState
  ? MatchFieldByFormDataType<TFormState[TFormKey]> extends never
    ? BaseFieldProps & AllFields
    : BaseFieldProps & MatchFieldByFormDataType<TFormState[TFormKey]>
  : never

type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never

type FormFieldConfig<TFormState extends IFormState = IFormState> = {
  [K in keyof TFormState]: BaseFieldProps &
    DistributiveOmit<
      MatchFieldByFormDataType<TFormState[K]>,
      '__formDataType' | '__finalDataType'
    >
}

type InferFinalDataType<
  TFormState extends IFormState,
  TFieldProps extends IFieldProps<TFormState> = IFieldProps<TFormState>
> = {
  [key in keyof TFormState]: key extends keyof TFieldProps
    ? TFieldProps[key] extends { __finalDataType: infer FinalDataType }
      ? FinalDataType
      : never
    : never
}

type Field<TField extends AllFields> = IFieldProps<IFormState> & TField

type InferFormInputProps<TField extends AllFields> = {
  field: Field<TField>
  selectedData: TField['__formDataType']
  namespace: string
  handleChange: (value: TField['__formDataType']) => void
}

export type {
  FormFieldConfig,
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
  IFormCheckboxFieldProps,
  InferFinalDataType,
  InferFormInputProps,
  Field
}
