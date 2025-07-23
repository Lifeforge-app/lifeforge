import { Button } from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { fetchAPI } from 'shared'

function CreatePasswordConfirmationModal({
  data: { newPassword, confirmPassword, endpoint },
  onClose
}: {
  data: {
    newPassword: string
    confirmPassword: string
    endpoint: string
  }
  onClose: () => void
}) {
  const [loading, setLoading] = useState(false)

  const { t } = useTranslation('common.vault')

  async function onSubmit(): Promise<void> {
    if (newPassword.trim() === '' || confirmPassword.trim() === '') {
      toast.error(t('input.error.fieldEmpty'))

      return
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      toast.error('Passwords do not match')

      return
    }

    setLoading(true)

    try {
      await fetchAPI(import.meta.env.VITE_API_HOST, endpoint, {
        method: 'POST',
        body: { password: newPassword }
      })

      window.location.reload()
    } catch {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <>
      <h1 className="text-2xl font-semibold">
        Make sure you remember your master password!
      </h1>
      <p className="text-bg-500 mt-2">
        This master password is unchangable for now! If you accidentally forget
        the password, you lose everything. This password is hashed and stored in
        your user profile, and it is not decryptable. It will be used to encrypt
        and decrypt the data you store in your vault.
      </p>
      <div className="mt-6 flex w-full justify-around gap-2">
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
          icon="tabler:check"
          loading={loading}
          onClick={() => {
            onSubmit().catch(console.error)
          }}
        >
          {!loading ? 'Confirm' : ''}
        </Button>
      </div>
    </>
  )
}

export default CreatePasswordConfirmationModal
