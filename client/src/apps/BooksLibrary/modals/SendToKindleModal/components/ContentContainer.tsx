import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { Button, EmptyStateScreen, TextInput, WithQuery } from 'lifeforge-ui'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

function ContentContainer({
  bookId,
  onClose
}: {
  bookId: string
  onClose: () => void
}) {
  const { t } = useTranslation('apps.booksLibrary')

  const enabledQuery = useQuery(
    forgeAPI.apiKeys.entries.checkKeys
      .input({ keys: 'smtp-user,smtp-pass' })
      .queryOptions()
  )

  const [kindleEmail, setKindleEmail] = useState('')

  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(async () => {
    setLoading(true)

    try {
      await forgeAPI.booksLibrary.entries.sendToKindle
        .input({
          id: bookId
        })
        .mutate({
          target: kindleEmail
        })

      toast.info(t('kindleSent', { email: kindleEmail }))
      onClose()
    } catch (error) {
      console.error(error)
      toast.error('Failed to send book to Kindle.')
    } finally {
      setLoading(false)
    }
  }, [kindleEmail])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && kindleEmail) {
      handleSubmit()
    }
  }

  return (
    <WithQuery query={enabledQuery}>
      {enabled =>
        enabled ? (
          <div className="space-y-4">
            <TextInput
              required
              icon="tabler:mail"
              inputMode="email"
              label="Kindle Email"
              namespace="apps.booksLibrary"
              placeholder="johndoe@kindle.com"
              setValue={setKindleEmail}
              value={kindleEmail}
              onKeyDown={handleKeyDown}
            />
            <Button
              className="w-full"
              disabled={!kindleEmail.match(/^[\w-.]+@kindle\.com$/)}
              icon="tabler:send"
              iconPosition="end"
              loading={loading}
              namespace="apps.booksLibrary"
              onClick={handleSubmit}
            >
              Send to Kindle
            </Button>
          </div>
        ) : (
          <div className="py-8">
            <EmptyStateScreen
              icon="tabler:send-off"
              name="noSMTPKeys"
              namespace="apps.booksLibrary"
            />
          </div>
        )
      }
    </WithQuery>
  )
}

export default ContentContainer
