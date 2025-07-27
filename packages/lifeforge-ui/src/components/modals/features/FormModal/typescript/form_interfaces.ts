/* eslint-disable @typescript-eslint/no-explicit-any */

/** --------- Utility Types ----------- */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never

type FieldsMap<T> = UnionToIntersection<
  T extends { type: infer K }
    ? K extends string | number | symbol
      ? { [P in K]: Extract<T, { type: K }> }
      : never
    : never
>

/** --------- Basic Types ----------- */
export type Location = {
  name: string
  formattedAddress: string
  location: { latitude: number; longitude: number }
}

export type FileData = {
  file: string | File | null
  preview: string | null
}

/** --------- Field Props Definitions ----------- */

export type BaseFieldProps = {
  label: string
  hidden?: boolean
  required?: boolean
  disabled?: boolean
}

type TextFieldProps = BaseFieldProps & {
  type: 'text'
  icon: string
  isPassword?: boolean
  placeholder: string
  qrScanner?: boolean
  __formDataType: string
  __finalDataType: string
}

type NumberFieldProps = BaseFieldProps & {
  type: 'number'
  icon: string
  placeholder: string
  __formDataType: number
  __finalDataType: number
}

type CurrencyFieldProps = BaseFieldProps & {
  type: 'currency'
  icon: string
  __formDataType: number
  __finalDataType: number
}

type TextAreaFieldProps = BaseFieldProps & {
  type: 'textarea'
  icon: string
  placeholder: string
  __formDataType: string
  __finalDataType: string
}

type DateFieldProps = BaseFieldProps & {
  type: 'datetime'
  icon: string
  hasTime?: boolean
  __formDataType: Date | null
  __finalDataType: string
}

type ListboxFieldProps<
  TOption = any,
  TMultiple extends boolean = boolean
> = BaseFieldProps & {
  type: 'listbox'
  icon: string
  multiple: TMultiple
  options: Array<{
    value: TOption
    text: string
    icon?: string
    color?: string
  }>
  nullOption?: string
  __formDataType: TMultiple extends true ? TOption[] : TOption | null
  __finalDataType: TMultiple extends true ? TOption[] : TOption | undefined
}

type ColorFieldProps = BaseFieldProps & {
  type: 'color'
  __formDataType: string
  __finalDataType: string
}

type IconFieldProps = BaseFieldProps & {
  type: 'icon'
  __formDataType: string
  __finalDataType: string
}

type FileFieldProps<TOptional extends boolean = false> = BaseFieldProps & {
  type: 'file'
  icon: string
  optional: TOptional
  onFileRemoved?: () => void
  enablePixabay?: boolean
  enableUrl?: boolean
  enableAIImageGeneration?: boolean
  defaultImageGenerationPrompt?: string
  __formDataType: FileData
  __finalDataType: string | File
}

type LocationFieldProps = BaseFieldProps & {
  type: 'location'
  __formDataType: Location | null
  __finalDataType: Location
}

type CheckboxFieldProps = BaseFieldProps & {
  type: 'checkbox'
  icon: string
  __formDataType: boolean
  __finalDataType: boolean
}

/** --------- Union of All Field Props ----------- */
type FormFieldPropsUnion =
  | TextFieldProps
  | NumberFieldProps
  | CurrencyFieldProps
  | TextAreaFieldProps
  | DateFieldProps
  | ListboxFieldProps
  | ColorFieldProps
  | IconFieldProps
  | FileFieldProps
  | LocationFieldProps
  | CheckboxFieldProps

type FormFieldTypeMap = FieldsMap<FormFieldPropsUnion>
/** --------- Associated/Helper Types ----------- */
type FormState = Record<string, any>

// Find field type by data type (usually for automatic inference)
type MatchFieldByFormDataType<T> = Extract<
  FormFieldPropsUnion,
  { __finalDataType: T extends { __type: 'media' } ? string | File : T }
>

type MatchFieldByType<TType> = Extract<FormFieldPropsUnion, { type: TType }>

// Find props by field type (for customization/override)
type MatchFieldByFieldType<TField> = TField extends {
  type: infer FieldType
}
  ? MatchFieldByType<FieldType>
  : never

// Single field inference
type Field<TField extends FormFieldPropsUnion> = TField & BaseFieldProps

// Props for component usage
type FormInputProps<TField extends FormFieldPropsUnion> = {
  field: Field<TField>
  selectedData: TField['__formDataType']
  namespace: string
  handleChange: (value: TField['__formDataType']) => void
}

/** --------- Form Field Configuration (for business developers) ----------- */

type FieldsConfig<
  TFormState extends FormState = FormState,
  TFieldType extends {
    [K in keyof TFormState]: MatchFieldByFormDataType<TFormState[K]>['type']
  } = {
    [K in keyof TFormState]: MatchFieldByFormDataType<TFormState[K]>['type']
  }
> = Partial<{
  [K in keyof TFormState]: DistributiveOmit<
    TFieldType[K] extends 'listbox'
      ? ListboxFieldProps<
          TFormState[K] extends Array<infer TOption> ? TOption : TFormState[K]
        >
      : TFieldType[K] extends 'file'
        ? FileFieldProps<
            TFormState[K] extends { config: { optional: infer TOptional } }
              ? TOptional extends boolean
                ? TOptional
                : false
              : false
          >
        : FormFieldTypeMap[TFieldType[K]],
    '__formDataType' | '__finalDataType' | 'type'
  > &
    BaseFieldProps
}>

type InferListboxOptions<TOption> = TOption extends {
  value: infer TValue
  text: string
}
  ? TValue
  : never

// Infer form state type from fields
type InferFormState<TFieldTypes, TFields> = {
  [K in keyof TFieldTypes]: TFieldTypes[K] extends infer TFieldType
    ? TFieldType extends 'listbox'
      ? TFields[K extends keyof TFields ? K : never] extends {
          options: Array<infer TOption>
        }
        ? TFields[K extends keyof TFields ? K : never] extends {
            multiple: true
          }
          ? InferListboxOptions<TOption>[]
          : InferListboxOptions<TOption>
        : never
      : MatchFieldByType<TFieldType>['__formDataType']
    : never
}

// Infer final form data type
type InferListBoxDataType<TField> = TField extends {
  options: Array<infer TOption>
}
  ? TField extends { multiple: true }
    ? InferListboxOptions<TOption>[]
    : TField extends { required: true }
      ? InferListboxOptions<TOption>
      : InferListboxOptions<TOption> | undefined
  : never

type InferFormFinalState<
  TFieldTypes,
  TFieldProps extends FieldsConfig<any, any>
> = {
  [key in keyof TFieldTypes]: TFieldTypes[key] extends infer TFieldType
    ? TFieldType extends FormFieldPropsUnion['type']
      ? TFieldType extends 'listbox'
        ? InferListBoxDataType<TFieldProps[key]>
        : MatchFieldByType<TFieldType>['__finalDataType']
      : never
    : never
}

/** --------- Types exported for business developers ----------- */
export type {
  // Basic
  FormFieldPropsUnion,
  FormFieldTypeMap,
  FormState,
  FieldsConfig,
  // Field props
  TextFieldProps,
  NumberFieldProps,
  CurrencyFieldProps,
  TextAreaFieldProps,
  DateFieldProps,
  ListboxFieldProps,
  ColorFieldProps,
  IconFieldProps,
  FileFieldProps,
  LocationFieldProps,
  CheckboxFieldProps,
  // Utilities
  MatchFieldByFormDataType,
  MatchFieldByFieldType,
  InferFormState,
  InferFormFinalState,
  FormInputProps,
  Field
}
