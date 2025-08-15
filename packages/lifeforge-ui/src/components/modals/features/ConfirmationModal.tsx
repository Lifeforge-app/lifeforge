import clsx from 'clsx'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '../../buttons/Button'
import { TextInput } from '../../inputs'

function ConfirmationModal({
  onClose,
  data: {
    title,
    description,
    confirmationButton = 'confirm',
    confirmationPrompt,
    onConfirm
  }
}: {
  onClose: () => void
  data: {
    title: string
    description: string
    confirmationButton?:
      | 'delete'
      | 'confirm'
      | React.ComponentProps<typeof Button>
    confirmationPrompt?: string
    onConfirm: () => Promise<void>
  }
}) {
  const { t } = useTranslation(['common.modals', 'common.buttons'])

  const [loading, setLoading] = useState(false)

  const [confirmationTextState, setConfirmationTextState] = useState('')

  const onClick = async () => {
    setLoading(true)

    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error('Error during confirmation:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-w-[40vw]">
      <h1 className="flex items-center text-2xl font-semibold">{title}</h1>
      <p className="text-bg-500 mt-2">{description}</p>
      {confirmationPrompt && (
        <TextInput
          className="mt-4"
          icon="tabler:alert-triangle"
          label="deleteConfirmation.confirmation"
          namespace="common.modals"
          placeholder={t(
            'common.modals:deleteConfirmation.inputs.confirmation.placeholder',
            {
              text: confirmationPrompt
            }
          )}
          setValue={setConfirmationTextState}
          value={confirmationTextState}
        />
      )}
      <div className="mt-6 flex w-full flex-col-reverse justify-around gap-2 sm:flex-row">
        <Button
          className="w-full"
          icon=""
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
        {typeof confirmationButton === 'string' ? (
          <Button
            className="w-full"
            dangerous={confirmationButton === 'delete'}
            disabled={
              !!confirmationPrompt &&
              confirmationPrompt !== confirmationTextState
            }
            icon={
              confirmationButton === 'delete' ? 'tabler:trash' : 'tabler:check'
            }
            loading={loading}
            onClick={onClick}
          >
            {t([
              `common.buttons:${confirmationButton === 'delete' ? 'delete' : 'confirm'}`,
              _.upperFirst(confirmationButton)
            ])}
          </Button>
        ) : (
          <Button
            {...confirmationButton}
            className={clsx('w-full', confirmationButton.className)}
            onClick={onClick}
          />
        )}
      </div>
    </div>
  )
}

export default ConfirmationModal
