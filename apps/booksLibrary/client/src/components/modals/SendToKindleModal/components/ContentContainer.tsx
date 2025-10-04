import forgeAPI from '@/utils/forgeAPI'
import { useQuery } from '@tanstack/react-query'
import { Button, EmptyStateScreen, TextInput, WithQuery } from 'lifeforge-ui'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { usePromiseLoading } from 'shared'

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

  const handleSubmit = useCallback(async () => {
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
    }
  }, [kindleEmail])

  const [loading, onSubmit] = usePromiseLoading(handleSubmit)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && kindleEmail) {
      onSubmit()
    }
  }

  return (
    <WithQuery query={enabledQuery}>
      {enabled =>
        enabled ? (
          <div className="space-y-3">
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
              onClick={onSubmit}
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
