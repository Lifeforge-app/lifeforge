/* eslint-disable @typescript-eslint/no-explicit-any */
import FormModal from '..'
import type {
  FieldsConfig,
  FormState,
  InferFormFinalState,
  InferFormState,
  MatchFieldByFormDataType
} from '../typescript/form_interfaces'

type FlattenUnion<T> = {
  [K in T extends any ? keyof T : never]: T extends { [k in K]?: any }
    ? T[K]
    : never
}

class FormBuilder<
  TFormState extends FormState,
  TFieldType extends {
    [K in keyof TFormState]: MatchFieldByFormDataType<TFormState[K]>['type']
  } = {
    [K in keyof TFormState]: MatchFieldByFormDataType<TFormState[K]>['type']
  },
  TFieldsConfig = undefined,
  TFinalFields = undefined,
  TInitialData = undefined,
  TOnSubmit = undefined,
  TOnChange = undefined
> {
  private readonly uiConfig?: React.ComponentProps<typeof FormModal>['ui']
  private readonly fieldType?: TFieldType
  private readonly fields?: TFieldsConfig
  private readonly finalFields?: TFinalFields
  private readonly _initialData?: TInitialData
  private readonly _onChange?: TOnChange
  private readonly _onSubmit?: TOnSubmit

  constructor(opts?: {
    uiConfig?: React.ComponentProps<typeof FormModal>['ui']
    fieldType?: TFieldType
    fields?: TFieldsConfig
    finalFields?: TFinalFields
    initialData?: TInitialData
    onSubmit?: TOnSubmit
    onChange?: TOnChange
  }) {
    if (opts) {
      this.uiConfig = opts.uiConfig
      this.fieldType = opts.fieldType
      this.fields = opts.fields
      this.finalFields = opts.finalFields
      this._initialData = opts.initialData
      this._onChange = opts.onChange
      this._onSubmit = opts.onSubmit
    }
  }

  ui(
    uiConfig: React.ComponentProps<typeof FormModal>['ui']
  ): FormBuilder<
    TFormState,
    TFieldType,
    TFieldsConfig,
    TFinalFields,
    TInitialData,
    TOnSubmit,
    TOnChange
  > {
    return new FormBuilder({
      ...this,
      uiConfig
    })
  }

  typesMap<
    TFieldType2 extends {
      [K in keyof TFormState]: MatchFieldByFormDataType<TFormState[K]>['type']
    }
  >(
    fieldType: TFieldType2
  ): FormBuilder<
    TFormState,
    TFieldType2,
    TFieldsConfig,
    TFinalFields,
    TInitialData,
    TOnSubmit,
    TOnChange
  > {
    return new FormBuilder({
      ...this,
      fieldType
    })
  }

  setupFields<TFields extends FieldsConfig<TFormState, TFieldType>>(
    fields: TFields
  ): FormBuilder<
    TFormState,
    TFieldType,
    TFields,
    {
      [K in keyof TFields]: TFields[K] & {
        type: TFieldType[K extends keyof TFieldType ? K : never]
      }
    },
    TInitialData,
    TOnSubmit,
    TOnChange
  > {
    for (const key in fields) {
      ;(fields[key] as any).type = (this.fieldType as any)[key]
    }
    type TFinalFields2 = {
      [K in keyof TFields]: TFields[K] & {
        type: TFieldType[K extends keyof TFieldType ? K : never]
      }
    }

    return new FormBuilder({
      ...this,
      fields,
      finalFields: fields as unknown as TFinalFields2
    })
  }

  initialData(
    initialData?: Partial<
      InferFormState<NonNullable<TFieldType>, NonNullable<TFinalFields>>
    >
  ): FormBuilder<
    TFormState,
    TFieldType,
    TFieldsConfig,
    TFinalFields,
    typeof initialData,
    TOnSubmit,
    TOnChange
  > {
    return new FormBuilder({
      uiConfig: this.uiConfig,
      fieldType: this.fieldType,
      fields: this.fields,
      finalFields: this.finalFields,
      initialData
    })
  }

  onSubmit(
    callback: (
      data: InferFormFinalState<
        NonNullable<TFieldType>,
        NonNullable<TFinalFields>
      >
    ) => Promise<void>
  ): FormBuilder<
    TFormState,
    TFieldType,
    TFieldsConfig,
    TFinalFields,
    TInitialData,
    typeof callback,
    TOnChange
  > {
    return new FormBuilder({
      uiConfig: this.uiConfig,
      fieldType: this.fieldType,
      fields: this.fields,
      finalFields: this.finalFields,
      initialData: this._initialData,
      onSubmit: callback,
      onChange: this._onChange
    })
  }

  onChange(
    callback: (
      data: InferFormState<NonNullable<TFieldType>, NonNullable<TFinalFields>>
    ) => void
  ): FormBuilder<
    TFormState,
    TFieldType,
    TFieldsConfig,
    TFinalFields,
    TInitialData,
    TOnSubmit,
    typeof callback
  > {
    return new FormBuilder({
      uiConfig: this.uiConfig,
      fieldType: this.fieldType,
      fields: this.fields,
      finalFields: this.finalFields,
      initialData: this._initialData,
      onSubmit: this._onSubmit,
      onChange: callback
    })
  }

  build(): React.ComponentProps<typeof FormModal> {
    const {
      uiConfig,
      fieldType,
      finalFields,
      _initialData,
      _onSubmit,
      _onChange
    } = this

    if (!uiConfig || !fieldType || !finalFields || !_onSubmit) {
      throw new Error('FormBuilder: Some required steps not complete')
    }

    return {
      form: {
        fieldTypes: fieldType,
        fields: finalFields,
        initialData: _initialData as any,
        onSubmit: _onSubmit as unknown as (
          data: InferFormFinalState<any, any>
        ) => Promise<void>,
        onChange: _onChange as unknown as (
          data: InferFormFinalState<any, any>
        ) => void
      },
      ui: uiConfig
    }
  }
}

export default function defineForm<T extends FormState>(): FormBuilder<
  FlattenUnion<T>
> {
  return new FormBuilder<FlattenUnion<T>>()
}
