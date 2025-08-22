import { Button } from '@components/buttons'
import type {
  FormFieldPropsUnion,
  FormState,
  InferFormFinalState,
  InferFormState
} from '@components/modals/features/FormModal/typescript/form_interfaces'
import { LoadingScreen } from '@components/screens'
import { loadIcon } from '@iconify/react/dist/iconify.js'
import { stringToIcon, validateIconName } from '@iconify/utils'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePromiseLoading } from 'shared'
import type { ZodType } from 'zod/v4'
import type { StoreApi, UseBoundStore } from 'zustand'

import ModalHeader from '../../core/components/ModalHeader'
import FormInputs from './components/FormInputs'
import SubmitButton from './components/SubmitButton'
import { checkEmpty } from './utils/formUtils'

function validateField(
  validator: ((value: any) => boolean | string) | ZodType,
  value: any
) {
  if (typeof validator === 'function') {
    return validator(value)
  }

  const result = validator.safeParse(value)

  return result.success ? true : result.error.issues[0].message
}

function FormModal({
  form: {
    fields,
    fieldTypes,
    autoFocusableFieldId,
    onSubmit,
    onChange,
    conditionalFields
  },
  ui: {
    title,
    icon,
    namespace,
    loading = false,
    onClose,
    submitButton,
    actionButton
  },
  dataStore
}: {
  /** Form data and field configs. See the [main documentation](https://docs.lifeforge/melvinchia.dev/frontend/forms) for more details. */
  form: {
    fields: Record<string, FormFieldPropsUnion>
    fieldTypes: Record<string, FormFieldPropsUnion['type']>
    autoFocusableFieldId?: string
    onSubmit: (
      data: InferFormFinalState<typeof fieldTypes, typeof fields>
    ) => Promise<void>
    onChange?: (data: InferFormState<typeof fieldTypes, typeof fields>) => void
    conditionalFields?: {
      [K in keyof InferFormState<typeof fieldTypes, typeof fields>]?: (
        data: InferFormState<typeof fieldTypes, typeof fields>
      ) => boolean
    }
  }
  ui: {
    title: string
    icon: string
    onClose: () => void
    namespace?: string
    loading?: boolean
    submitButton: 'create' | 'update' | React.ComponentProps<typeof Button>
    actionButton?: React.ComponentProps<typeof Button>
  }
  dataStore: UseBoundStore<
    StoreApi<InferFormState<typeof fieldTypes, typeof fields>>
  >
}) {
  const { t } = useTranslation('common.misc')

  const [data, setData] = useState(() => dataStore.getState())

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(data => {
      setData(data)
      console.log(data)
    })

    return unsubscribe
  }, [dataStore])

  const [errorMsgs, setErrorMsgs] = useState<
    Record<string, string | undefined>
  >({})

  /**
   * Handles the form submission process for the FormModal component.
   *
   * @remarks
   * The function handles various field types with specific transformations:
   * - `datetime`: Converts to ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
   * - `location`: Ensures undefined for falsy values
   * - `currency`/`number`: Converts to Number type
   * - `file`: Extracts the file property from the file object
   * - `checkbox`: Converts to Boolean type
   *
   * @returns A Promise that resolves when the submission process is complete
   *
   * @throws Will not throw errors directly, but may propagate errors from the onSubmit callback
   */
  async function handleSubmit(): Promise<void> {
    const visibleFields = Object.entries(fields).filter(field => {
      // Explicitly defined hidden state takes precedence
      if (field[1].hidden) {
        return false
      }

      const conditionalCall = conditionalFields?.[field[0]]?.(data)

      if (typeof conditionalCall === 'boolean') {
        return conditionalCall
      }

      return true
    })

    // Transform field values based on their types
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

    const validationResults: Record<string, string | undefined> = {}

    for (const [key, field] of visibleFields) {
      const value = finalData[key]

      const isEmpty = checkEmpty(value)

      // If the field is empty and required, set the validation message,
      // otherwise skip the validation
      if (isEmpty) {
        validationResults[key] = field.required ? t('fieldRequired') : undefined
        continue
      }

      // Validate color format
      // Should be a valid hex color code
      if (field.type === 'color' && !/^#[0-9A-F]{6}$/i.test(value as string)) {
        validationResults[key] = t('invalidColor')
        continue
      }

      if (field.type === 'icon') {
        if (!validateIconName(stringToIcon(value as string))) {
          validationResults[key] = t('invalidIcon')
          continue
        }

        try {
          await loadIcon(value as string)
        } catch {
          validationResults[key] = t('invalidIcon')
          continue
        }
      }

      const result = field.validator
        ? validateField(field.validator, value as never)
        : true

      if (typeof result === 'string') {
        validationResults[key] = result
        continue
      }

      validationResults[key] = result === true ? undefined : 'Invalid field'
    }

    if (
      !Object.values(validationResults).every(result => result === undefined)
    ) {
      setErrorMsgs(validationResults)

      return
    }

    // Call the onSubmit callback with the final data
    // Close the modal on successful submission
    if (onSubmit) {
      try {
        await onSubmit(
          finalData as InferFormFinalState<typeof fieldTypes, typeof fields>
        )
        onClose()
      } catch (error) {
        // Leave the error handling to the parent component
        console.log('Form submission error:', error)
      }
    }
  }

  const removeErrorMsg = (fieldId: string) => {
    setErrorMsgs(prev => ({ ...prev, [fieldId]: undefined }))
  }

  const [submitButtonLoading, onSubmitButtonClick] =
    usePromiseLoading(handleSubmit)

  // Notify parent component of data changes
  useEffect(() => {
    onChange?.(data)
  }, [data, onChange])

  return (
    <div className="flex min-w-[50vw] flex-col">
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
            autoFocusableFieldId={autoFocusableFieldId}
            conditionalFields={conditionalFields}
            data={data as FormState}
            errorMsgs={errorMsgs}
            fields={fields}
            namespace={namespace}
            removeErrorMsg={removeErrorMsg}
            setStore={dataStore.setState}
          />
          <SubmitButton
            submitButton={submitButton}
            submitLoading={submitButtonLoading}
            onSubmitButtonClick={onSubmitButtonClick}
          />
        </>
      ) : (
        <div className="flex-center min-h-96 flex-1 flex-col">
          <LoadingScreen />
        </div>
      )}
    </div>
  )
}

export default FormModal
