/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@components/buttons'
import type {
  FieldsConfig,
  FormFieldPropsUnion,
  FormState,
  InferFormFinalState,
  InferFormState
} from '@components/modals/features/FormModal/typescript/form_interfaces'
import { LoadingScreen } from '@components/screens'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
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

  if (value instanceof Date) {
    return isNaN(value.getTime())
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
      if (formExistedData && key in formExistedData && formExistedData[key]) {
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

function FormModal({
  form: {
    fields,
    fieldTypes,
    initialData,
    additionalFields,
    onSubmit,
    onChange
  },
  ui: { title, icon, namespace, loading = false, onClose, submitButton },
  actionButton,
  externalData
}: {
  form: {
    fields: Record<string, FormFieldPropsUnion>
    fieldTypes: Record<string, FormFieldPropsUnion['type']>
    initialData?: Partial<InferFormState<typeof fieldTypes, typeof fields>>
    additionalFields?: React.ReactNode
    onSubmit: (
      data: InferFormFinalState<typeof fieldTypes, typeof fields>
    ) => Promise<void>
    onChange?: (data: InferFormState<typeof fieldTypes, typeof fields>) => void
  }
  ui: {
    title: string
    icon: string
    onClose: () => void
    namespace: string | false
    loading?: boolean
    submitButton: 'create' | 'update' | React.ComponentProps<typeof Button>
  }
  actionButton?: {
    icon: string
    isRed?: boolean
    onClick?: () => void
  }
  externalData?: {
    data: InferFormState<typeof fieldTypes, typeof fields>
    setData: React.Dispatch<
      React.SetStateAction<InferFormState<typeof fieldTypes, typeof fields>>
    >
  }
}) {
  const [internalData, setInternalData] = useState<
    InferFormState<typeof fieldTypes, typeof fields>
  >(
    getInitialData(fieldTypes, fields, initialData) as InferFormState<
      typeof fieldTypes,
      typeof fields
    >
  )

  const data = externalData ? externalData.data : internalData

  const setData = externalData ? externalData.setData : setInternalData

  const [submitLoading, setSubmitLoading] = useState(false)

  async function onSubmitButtonClick(): Promise<void> {
    const requiredFields = Object.entries(fields).filter(
      field => field[1]?.required && !field[1].hidden
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
        await onSubmit(
          finalData as InferFormFinalState<typeof fieldTypes, typeof fields>
        )
        onClose()
      } finally {
        setSubmitLoading(false)
      }
    }
  }

  useEffect(() => {
    onChange?.(data)
  }, [data, onChange])

  return (
    <div className="min-w-[50vw]">
      <ModalHeader
        actionButtonProps={actionButton}
        icon={icon}
        namespace={namespace ? namespace : undefined}
        title={title}
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
