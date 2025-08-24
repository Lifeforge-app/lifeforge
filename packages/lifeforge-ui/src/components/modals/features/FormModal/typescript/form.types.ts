/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ZodType } from 'zod'

import type { CheckboxFieldProps } from '../components/FormInputs/components/FormCheckboxInput'
import type { ColorFieldProps } from '../components/FormInputs/components/FormColorInput'
import type { CurrencyFieldProps } from '../components/FormInputs/components/FormCurrencyInput'
import type { DateFieldProps } from '../components/FormInputs/components/FormDateInput'
import type { FileFieldProps } from '../components/FormInputs/components/FormFileInput'
import type { IconFieldProps } from '../components/FormInputs/components/FormIconInput'
import type { ListboxFieldProps } from '../components/FormInputs/components/FormListboxInput'
import type { LocationFieldProps } from '../components/FormInputs/components/FormLocationInput'
import type { NumberFieldProps } from '../components/FormInputs/components/FormNumberInput'
import type { RRuleFieldProps } from '../components/FormInputs/components/FormRRuleInput'
import type { TextAreaFieldProps } from '../components/FormInputs/components/FormTextAreaInput'
import type { TextFieldProps } from '../components/FormInputs/components/FormTextInput'

export type BaseFieldProps<
  TFormDataType,
  TFinalDataType,
  TAutoFocusable extends boolean = false
> = {
  label: string
  hidden?: boolean
  required?: boolean
  disabled?: boolean
  __formDataType: TFormDataType
  __finalDataType: TFinalDataType
  __autoFocusable?: TAutoFocusable
}

/** --------- Utility Types ----------- */
export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never

export type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never

export type FieldsMap<T> = UnionToIntersection<
  T extends { type: infer K }
    ? K extends string | number | symbol
      ? { [P in K]: Extract<T, { type: K }> }
      : never
    : never
>

export type FormFieldTypeMap = FieldsMap<FormFieldPropsUnion>

export type FormState = Record<string, any>

// Find field type by data type (usually for automatic inference)
export type MatchFieldByFormDataType<T> = Extract<
  FormFieldPropsUnion,
  { __finalDataType: T extends { __type: 'media' } ? string | File : T }
>

export type MatchFieldByType<TType> = Extract<
  FormFieldPropsUnion,
  { type: TType }
>

// Find props by field type (for customization/override)
export type MatchFieldByFieldType<TField> = TField extends {
  type: infer FieldType
}
  ? MatchFieldByType<FieldType>
  : never

// Single field inference
export type Field<TField extends FormFieldPropsUnion> = TField &
  BaseFieldProps<TField['__formDataType'], TField['__finalDataType']>

// Props for component usage
export type FormInputProps<TField extends FormFieldPropsUnion> = {
  field: Field<TField> & {
    errorMsg?: string
  }
  value: TField['__formDataType']
  autoFocus?: boolean
  namespace?: string
  options?: {
    value: string
    text: string
    icon?: string
    color?: string
  }[]
  handleChange: (value: TField['__formDataType']) => void
}

/** --------- Form Field Configuration (for developers) ----------- */

export type InferFinalFieldConfig<
  TFieldType extends FormFieldPropsUnion['type'],
  TFormState,
  TAllFormState
> = TFieldType extends 'listbox'
  ? ListboxFieldProps<
      TFormState extends Array<infer TOption> ? TOption : TFormState,
      boolean,
      TAllFormState
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

export type FieldsConfig<
  TFormState extends FormState = FormState,
  TFieldType extends {
    [K in keyof TFormState]: MatchFieldByFormDataType<TFormState[K]>['type']
  } = {
    [K in keyof TFormState]: MatchFieldByFormDataType<TFormState[K]>['type']
  }
> = Partial<{
  [K in keyof TFormState]: InferFinalFieldConfig<
    TFieldType[K],
    TFormState[K],
    InferFormState<TFieldType, TFormState>
  > extends infer TField
    ? DistributiveOmit<
        TField,
        'type' | '__finalDataType' | '__formDataType' | '__autoFocusable'
      > & {
        validator?:
          | ((
              value: InferFormFinalState<TFieldType, TFormState>[K],
              formState: TFormState
            ) => boolean | string)
          | ZodType
      }
    : never
}>

export type InferListboxOptions<TOption> = TOption extends {
  value: infer TValue
  text: string
}
  ? TValue
  : never

export type ExtractOptionsArray<TOptions> =
  TOptions extends Array<infer TOption>
    ? TOption
    : TOptions extends (...args: any[]) => Array<infer TOption>
      ? TOption
      : never

export type InferListBoxFormState<TField> = TField extends {
  options: infer TOptions
}
  ? TField extends {
      multiple: true
    }
    ? InferListboxOptions<ExtractOptionsArray<TOptions>>[]
    : InferListboxOptions<ExtractOptionsArray<TOptions>>
  : never

export type InferFormState<TFieldTypes, TFields> = {
  [K in keyof TFieldTypes]: TFieldTypes[K] extends infer TFieldType
    ? TFieldType extends 'listbox'
      ? InferListBoxFormState<TFields[K extends keyof TFields ? K : never]>
      : MatchFieldByType<TFieldType>['__formDataType']
    : never
}

export type InferListBoxFinalState<TField> = TField extends {
  options: infer TOptions
}
  ? TField extends { multiple: true }
    ? InferListboxOptions<ExtractOptionsArray<TOptions>>[]
    : TField extends { required: true }
      ? InferListboxOptions<ExtractOptionsArray<TOptions>>
      : InferListboxOptions<ExtractOptionsArray<TOptions>> | undefined
  : never

export type InferFormFinalState<
  TFieldTypes,
  TFieldProps extends FieldsConfig<any, any>
> = {
  [K in keyof TFieldTypes]: TFieldTypes[K] extends infer TFieldType
    ? TFieldType extends 'listbox'
      ? InferListBoxFinalState<TFieldProps[K]>
      : MatchFieldByType<TFieldType>['__finalDataType']
    : never
}

export type IsAutoFocusable<TType> =
  MatchFieldByType<TType> extends infer TField
    ? TField extends { __autoFocusable?: true }
      ? true
      : false
    : false

export type InferAutoFocusableFieldIds<TFieldTypes> = {
  [K in keyof TFieldTypes]: IsAutoFocusable<TFieldTypes[K]> extends true
    ? K
    : never
}[keyof TFieldTypes]

export type FormFieldPropsUnion =
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
