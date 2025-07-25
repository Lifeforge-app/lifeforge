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

type IListboxInputFieldProps<TMultiple extends boolean = false> = {
  type: 'listbox'
  icon: string
  multiple?: TMultiple | unknown
  options: Array<{
    value: any
    text: string
    icon?: string
    color?: string
  }>
  nullOption?: string
  __formDataType: TMultiple extends true ? any[] : any | null
  __finalDataType: TMultiple extends true ? any[] : any | null
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

type MatchFieldByFieldType<TField> = TField extends {
  type: infer FieldType
}
  ? FieldType extends AllFields['type']
    ? Extract<AllFields, { type: FieldType }>
    : never
  : never

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

type InferFormStateFromFields<TFields> = {
  [K in keyof TFields]: TFields[K] extends {
    type: infer TFieldType
  }
    ? TFieldType extends AllFields['type']
      ? TFieldType extends 'listbox'
        ? TFields[K] extends { options: Array<infer TOption> }
          ? TOption extends { value: infer TValue; text: string }
            ? TValue
            : never
          : never
        : MatchFieldByFieldType<TFields[K]>['__formDataType']
      : never
    : never
}

type InferListBoxDataType<TField> = TField extends {
  options: Array<infer TOption>
}
  ? TOption extends { value: infer TValue }
    ? TField extends { multiple: true }
      ? TValue[]
      : TField extends { required: true }
        ? TValue
        : TValue | null
    : never
  : never

type InferFinalDataType<TFieldProps extends FormFieldConfig<any>> = {
  [key in keyof TFieldProps]: TFieldProps[key] extends {
    type: infer TFieldType
  }
    ? TFieldType extends AllFields['type']
      ? TFieldType extends 'listbox'
        ? InferListBoxDataType<TFieldProps[key]>
        : MatchFieldByFieldType<TFieldProps[key]>['__finalDataType']
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
  AllFields,
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
  InferFormStateFromFields,
  InferFinalDataType,
  InferFormInputProps,
  Field
}
