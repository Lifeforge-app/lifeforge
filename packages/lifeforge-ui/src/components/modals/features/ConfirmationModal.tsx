import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '../../buttons/Button'
import { TextInput } from '../../inputs'

function ConfirmationModal({
  onClose,
  data: {
    title,
    description,
    buttonType = 'confirm',
    confirmationPrompt,
    onConfirm
  }
}: {
  onClose: () => void
  data: {
    title: string
    description: string
    buttonType?: 'delete' | 'confirm'
    confirmationPrompt?: string
    onConfirm: () => Promise<void>
  }
}) {
  const { t } = useTranslation('common.modals')

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
          darker
          className="mt-4"
          icon="tabler:alert-triangle"
          name="Confirmation"
          namespace="common.modals"
          placeholder={t('deleteConfirmation.inputs.confirmation.placeholder', {
            text: confirmationPrompt
          })}
          setValue={setConfirmationTextState}
          tKey="deleteConfirmation"
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
        <Button
          className="w-full"
          disabled={
            !!confirmationPrompt && confirmationPrompt !== confirmationTextState
          }
          icon={buttonType === 'delete' ? 'tabler:trash' : 'tabler:check'}
          isRed={buttonType === 'delete'}
          loading={loading}
          onClick={onClick}
        >
          {buttonType}
        </Button>
      </div>
    </div>
  )
}

export default ConfirmationModal
