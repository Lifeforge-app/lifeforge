import {
  Button,
  EmptyStateScreen,
  LoadingScreen,
  TextInput
} from 'lifeforge-ui'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'

function ContentContainer({
  bookId,
  onClose
}: {
  bookId: string
  onClose: () => void
}) {
  const { t } = useTranslation('apps.booksLibrary')

  const [enabled, setEnabled] = useState<boolean | 'loading'>('loading')

  const [kindleEmail, setKindleEmail] = useState('')

  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(async () => {
    setLoading(true)

    try {
      fetchAPI(
        import.meta.env.VITE_API_HOST,
        `books-library/entries/send-to-kindle/${bookId}`,
        {
          method: 'POST',
          body: { target: kindleEmail }
        }
      )

      toast.info(t('kindleSent', { email: kindleEmail }))
      onClose()
    } catch (error) {
      console.error(error)
      toast.error('Failed to send book to Kindle.')
    } finally {
      setLoading(false)
    }
  }, [kindleEmail])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && kindleEmail) {
        handleSubmit()
      }
    },
    [kindleEmail, handleSubmit]
  )

  useEffect(() => {
    fetchAPI<boolean>(
      import.meta.env.VITE_API_HOST,
      'api-keys/entries/check?keys=smtp-user,smtp-pass'
    )
      .then(isEnabled => {
        setEnabled(isEnabled)
      })
      .catch(() => {
        setEnabled(false)
        toast.error('Failed to check SMTP API keys.')
      })
  }, [])

  if (enabled === 'loading') {
    return <LoadingScreen customMessage={t('checkingKeys')} />
  }

  if (!enabled) {
    return (
      <div className="py-8">
        <EmptyStateScreen
          icon="tabler:send-off"
          name="noSMTPKeys"
          namespace="apps.booksLibrary"
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <TextInput
        darker
        required
        icon="tabler:mail"
        inputMode="email"
        name="Kindle Email"
        namespace="apps.booksLibrary"
        placeholder="johndoe@kindle.com"
        setValue={setKindleEmail}
        value={kindleEmail}
        onKeyDown={handleKeyDown}
      />
      <Button
        iconAtEnd
        className="w-full"
        disabled={!kindleEmail.match(/^[\w-.]+@kindle\.com$/)}
        icon="tabler:send"
        loading={loading}
        namespace="apps.booksLibrary"
        onClick={handleSubmit}
      >
        Send to Kindle
      </Button>
    </div>
  )
}

export default ContentContainer
