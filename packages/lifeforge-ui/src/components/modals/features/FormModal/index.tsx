/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@components/buttons'
import type {
  FieldsConfig,
  FormFieldPropsUnion,
  FormState,
  InferFormFinalState,
  InferFormState,
  MatchFieldByFormDataType
} from '@components/modals/features/FormModal/typescript/form_interfaces'
import { LoadingScreen } from '@components/screens'
import dayjs from 'dayjs'
import { useState } from 'react'
import { toast } from 'react-toastify'

import ModalHeader from '../../core/components/ModalHeader'
import FormInputs from './components/FormInputs'
import SubmitButton from './components/SubmitButton'

const transformExistedData = (fieldType: string, value: unknown): unknown => {
  if (fieldType === 'datetime' && value) {
    return dayjs(value as string).toDate()
  }

  return value
}

const checkEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return true
  }

  if (typeof value === 'string' && value.trim() === '') {
    return true
  }

  if (Array.isArray(value) && value.length === 0) {
    return true
  }

  if (typeof value === 'object') {
    if (Object.keys(value).length === 0) {
      return true
    }

    if ('file' in value && (!value.file || value.file === 'removed')) {
      return true
    }

    if (
      'name' in value &&
      'formattedAddress' in value &&
      !value.name &&
      !value.formattedAddress
    ) {
      return true
    }
  }

  return false
}

const getInitialData = <TFormConfig extends FieldsConfig<any, any>>(
  fieldTypes: Record<string, FormFieldPropsUnion['type']>,
  fields: TFormConfig,
  formExistedData?: Partial<InferFormState<any, TFormConfig>>
) => {
  return Object.fromEntries(
    Object.entries(fieldTypes).map(([key, fieldType]) => {
      if (formExistedData && key in formExistedData) {
        return [key, transformExistedData(fieldType, formExistedData[key])]
      }

      let finalValue: unknown = ''

      switch (fieldType) {
        case 'number':
        case 'currency':
          finalValue = 0
          break
        case 'datetime':
        case 'location':
          finalValue = null
          break
        case 'listbox':
          finalValue = fields[key]?.multiple ? [] : null
          break
        case 'checkbox':
          finalValue = false
          break
        case 'file':
          finalValue = { file: null, preview: null }
          break
        default:
          finalValue = ''
      }

      return [key, finalValue]
    })
  )
}

function FormModal<
  TFormState extends FormState,
  TFieldTypes extends {
    [K in keyof TFormState]: MatchFieldByFormDataType<TFormState[K]>['type']
  },
  TFields extends FieldsConfig<any, any>
>({
  form: { fields, fieldTypes, initialData, additionalFields, onSubmit },
  ui: { title, icon, namespace, loading = false, onClose, submitButton },
  actionButton
}: {
  form: {
    fields: TFields
    fieldTypes: TFieldTypes
    initialData?: Partial<InferFormState<TFieldTypes, TFields>>
    additionalFields?: React.ReactNode
    onSubmit: (data: InferFormFinalState<any, any>) => Promise<void>
  }
  ui: {
    title: string
    icon: string
    onClose: () => void
    namespace: string
    loading?: boolean
    submitButton: 'create' | 'update' | React.ComponentProps<typeof Button>
  }
  actionButton?: {
    icon: string
    isRed?: boolean
    onClick?: () => void
  }
}) {
  const [data, setData] = useState<InferFormState<TFieldTypes, TFields>>(
    getInitialData(fieldTypes, fields, initialData) as InferFormState<
      TFieldTypes,
      TFields
    >
  )

  const [submitLoading, setSubmitLoading] = useState(false)

  async function onSubmitButtonClick(): Promise<void> {
    const requiredFields = Object.entries(fields).filter(
      field => field[1]?.required
    )

    const missingFields = requiredFields.filter(field =>
      checkEmpty(data[field[0]])
    )

    if (missingFields.length) {
      toast.error(
        `The following fields are required: ${missingFields
          .map(field => field[1]?.label)
          .join(', ')}`
      )

      return
    }

    setSubmitLoading(true)

    const finalData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        const fieldType = fields[key]?.type

        if (!fieldType) {
          return [key, value]
        }

        let finalValue: unknown = value

        switch (fieldType) {
          case 'datetime':
            finalValue = value
              ? dayjs(value as never).format('YYYY-MM-DDTHH:mm:ssZ')
              : undefined
            break
          case 'location':
            finalValue = value ?? undefined
            break
          case 'currency':
          case 'number':
            finalValue = Number(value)
            break
          case 'file':
            finalValue =
              (value as { file: string | File | null }).file ?? undefined
            break
          case 'checkbox':
            finalValue = Boolean(value)
            break
          default:
            finalValue = value
        }

        return [key, finalValue]
      })
    )

    if (onSubmit) {
      try {
        await onSubmit(finalData as InferFormFinalState<TFieldTypes, TFields>)
      } finally {
        setSubmitLoading(false)
        onClose()
      }
    }
  }

  return (
    <div className="min-w-[50vw]">
      <ModalHeader
        actionButtonIcon={actionButton?.icon}
        actionButtonIsRed={actionButton?.isRed}
        icon={icon}
        namespace={namespace}
        title={title}
        onActionButtonClick={actionButton?.onClick}
        onClose={onClose}
      />
      {!loading ? (
        <>
          <FormInputs
            data={data as FormState}
            fields={fields}
            namespace={namespace}
            setData={setData as React.Dispatch<React.SetStateAction<FormState>>}
          />
          {additionalFields}
          <SubmitButton
            submitButton={submitButton}
            submitLoading={submitLoading}
            onSubmitButtonClick={onSubmitButtonClick}
          />
        </>
      ) : (
        <LoadingScreen />
      )}
    </div>
  )
}

export default FormModal
