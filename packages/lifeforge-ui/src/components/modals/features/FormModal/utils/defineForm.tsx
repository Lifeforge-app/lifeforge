/* eslint-disable @typescript-eslint/no-explicit-any */
import FormModal from '..'
import type {
  FieldsConfig,
  FormFieldPropsUnion,
  FormState,
  InferFormFinalState,
  InferFormState,
  MatchFieldByFormDataType
} from '../typescript/form_interfaces'

export default function defineForm<
  TFormState extends FormState,
  TFieldType extends {
    [K in keyof TFormState]: MatchFieldByFormDataType<TFormState[K]>['type']
  } = {
    [K in keyof TFormState]: MatchFieldByFormDataType<TFormState[K]>['type']
  }
>() {
  return {
    ui: (uiConfig: React.ComponentProps<typeof FormModal>['ui']) => {
      return {
        typesMap: <TFieldType2 extends TFieldType>(fieldType: TFieldType2) => {
          return {
            setupFields: <
              TFieldsConfig extends FieldsConfig<TFormState, typeof fieldType>
            >(
              fields: TFieldsConfig
            ) => {
              for (const key in fields) {
                ;(fields[key] as any)!.type = fieldType[
                  key
                ] as FormFieldPropsUnion['type']
              }

              const finalFields = fields as unknown as {
                [K in keyof TFieldsConfig]: TFieldsConfig[K] & {
                  type: (typeof fieldType)[K extends keyof typeof fieldType
                    ? K
                    : never]
                }
              }

              return {
                initialData: (
                  initialData?: Partial<
                    InferFormState<typeof fieldType, typeof finalFields>
                  >
                ) => {
                  return {
                    onSubmit: (
                      callback: (
                        data: InferFormFinalState<
                          typeof fieldType,
                          typeof finalFields
                        >
                      ) => Promise<void>
                    ) =>
                      ({
                        form: {
                          fieldTypes: fieldType,
                          fields: finalFields,
                          initialData: initialData,
                          onSubmit: callback
                        },
                        ui: uiConfig
                      }) satisfies React.ComponentProps<typeof FormModal>
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
