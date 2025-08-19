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

import ModalHeader from '../../core/components/ModalHeader'
import FormInputs from './components/FormInputs'
import SubmitButton from './components/SubmitButton'
import { checkEmpty, getInitialData } from './utils/formUtils'

function FormModal({
  form: {
    fields,
    fieldTypes,
    autoFocusableFieldId,
    initialData,
    onSubmit,
    onChange
  },
  ui: { title, icon, namespace, loading = false, onClose, submitButton },
  actionButton,
  externalData
}: {
  /** Form data and field configs. See the [main documentation](https://docs.lifeforge/melvinchia.dev/frontend/forms) for more details. */
  form: {
    fields: Record<string, FormFieldPropsUnion>
    fieldTypes: Record<string, FormFieldPropsUnion['type']>
    autoFocusableFieldId?: string
    initialData?: Partial<InferFormState<typeof fieldTypes, typeof fields>>
    onSubmit: (
      data: InferFormFinalState<typeof fieldTypes, typeof fields>
    ) => Promise<void>
    onChange?: (data: InferFormState<typeof fieldTypes, typeof fields>) => void
  }
  ui: {
    title: string
    icon: string
    onClose: () => void
    namespace?: string
    loading?: boolean
    submitButton: 'create' | 'update' | React.ComponentProps<typeof Button>
  }
  /** Action button to be displayed at the top right corner besides the close button. */
  actionButton?: {
    icon: string
    dangerous?: boolean
    onClick?: () => void
  }
  /** State of the form modal. Passing external data will override internal state, making the form state accessible from outside the component. */
  externalData?: {
    data: InferFormState<typeof fieldTypes, typeof fields>
    setData: React.Dispatch<
      React.SetStateAction<InferFormState<typeof fieldTypes, typeof fields>>
    >
  }
}) {
  const { t } = useTranslation('common.misc')

  const [internalData, setInternalData] = useState<
    InferFormState<typeof fieldTypes, typeof fields>
  >(
    getInitialData(fieldTypes, fields, initialData) as InferFormState<
      typeof fieldTypes,
      typeof fields
    >
  )

  // Determine the source of form data
  // If external data is provided, use it; otherwise, use internal state
  const data = externalData ? externalData.data : internalData

  const setData = externalData ? externalData.setData : setInternalData

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
    const nonHiddenFields = Object.entries(fields).filter(
      field => !field[1].hidden
    )

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

    for (const [key, field] of nonHiddenFields) {
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

      const result = field.validator ? field.validator(value as never) : true

      if (typeof result === 'string') {
        validationResults[key] = result
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
            autoFocusableFieldId={autoFocusableFieldId}
            data={data as FormState}
            errorMsgs={errorMsgs}
            fields={fields}
            namespace={namespace}
            removeErrorMsg={removeErrorMsg}
            setData={setData as React.Dispatch<React.SetStateAction<FormState>>}
          />
          <SubmitButton
            submitButton={submitButton}
            submitLoading={submitButtonLoading}
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
