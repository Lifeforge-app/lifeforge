/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TextInput } from '@components/inputs'

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

export type BaseFieldProps<TFormDataType, TFinalDataType> = {
  label: string
  hidden?: boolean
  required?: boolean
  disabled?: boolean
  validator?: (value: TFinalDataType) => boolean | string
  __formDataType: TFormDataType
  __finalDataType: TFinalDataType
}

type TextFieldProps = BaseFieldProps<string, string> & {
  type: 'text'
  icon: string
  isPassword?: boolean
  placeholder: string
  qrScanner?: boolean
  actionButtonProps?: React.ComponentProps<
    typeof TextInput
  >['actionButtonProps']
}

type NumberFieldProps = BaseFieldProps<number, number> & {
  type: 'number'
  icon: string
}

type CurrencyFieldProps = BaseFieldProps<number, number> & {
  type: 'currency'
  icon: string
}

type TextAreaFieldProps = BaseFieldProps<string, string> & {
  type: 'textarea'
  icon: string
  placeholder: string
}

type DateFieldProps = BaseFieldProps<Date | null, string> & {
  type: 'datetime'
  icon: string
  hasTime?: boolean
}

type ListboxFieldProps<
  TOption = any,
  TMultiple extends boolean = boolean
> = BaseFieldProps<
  TMultiple extends true ? TOption[] : TOption | null,
  TMultiple extends true ? TOption[] : TOption | undefined
> & {
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
}

type ColorFieldProps = BaseFieldProps<string, string> & {
  type: 'color'
}

type IconFieldProps = BaseFieldProps<string, string> & {
  type: 'icon'
}

type FileFieldProps<TOptional extends boolean = false> = BaseFieldProps<
  FileData,
  string | File
> & {
  type: 'file'
  icon: string
  optional: TOptional
  onFileRemoved?: () => void
  enablePixabay?: boolean
  enableUrl?: boolean
  enableAIImageGeneration?: boolean
  defaultImageGenerationPrompt?: string
  acceptedMimeTypes?: Record<string, string[]>
}

type LocationFieldProps = BaseFieldProps<Location | null, Location> & {
  type: 'location'
}

type CheckboxFieldProps = BaseFieldProps<boolean, boolean> & {
  type: 'checkbox'
  icon: string
}

type RRuleFieldProps = BaseFieldProps<string, string> & {
  type: 'rrule'
  hasDuration?: boolean
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
  | RRuleFieldProps

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
type Field<TField extends FormFieldPropsUnion> = TField &
  BaseFieldProps<TField['__formDataType'], TField['__finalDataType']>

// Props for component usage
type FormInputProps<TField extends FormFieldPropsUnion> = {
  field: Field<TField> & {
    errorMsg?: string
  }
  value: TField['__formDataType']
  namespace?: string
  handleChange: (value: TField['__formDataType']) => void
}

/** --------- Form Field Configuration (for business developers) ----------- */

type InferFinalField<
  TFieldType extends FormFieldPropsUnion['type'],
  TFormState
> = TFieldType extends 'listbox'
  ? ListboxFieldProps<
      TFormState extends Array<infer TOption> ? TOption : TFormState
    >
  : TFieldType extends 'file'
    ? FileFieldProps<
        TFormState extends { config: { optional: infer TOptional } }
          ? TOptional extends boolean
            ? TOptional
            : false
          : false
      >
    : FormFieldTypeMap[TFieldType]

type FieldsConfig<
  TFormState extends FormState = FormState,
  TFieldType extends {
    [K in keyof TFormState]: MatchFieldByFormDataType<TFormState[K]>['type']
  } = {
    [K in keyof TFormState]: MatchFieldByFormDataType<TFormState[K]>['type']
  }
> = Partial<{
  [K in keyof TFormState]: InferFinalField<
    TFieldType[K],
    TFormState[K]
  > extends infer TField
    ? DistributiveOmit<TField, 'type' | '__finalDataType' | '__formDataType'>
    : never
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
  RRuleFieldProps,
  // Utilities
  MatchFieldByFormDataType,
  MatchFieldByFieldType,
  InferFormState,
  InferFormFinalState,
  FormInputProps,
  Field
}
