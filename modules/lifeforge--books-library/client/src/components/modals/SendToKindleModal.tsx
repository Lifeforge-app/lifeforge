import { useQuery } from '@tanstack/react-query'
import { useCallback, useState } from 'react'

import { usePromiseLoading } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  EmptyStateScreen,
  ModalHeader,
  Stack,
  TextInput,
  WithQuery,
  toast
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

function SendToKindleModal({
  data: { bookId },
  onClose
}: {
  data: { bookId: string }
  onClose: () => void
}) {
  const { t } = useModuleTranslation()

  const enabledQuery = useQuery(
    forgeAPI.checkAPIKeys({ keys: 'smtp-user,smtp-pass' }).queryOptions()
  )

  const [kindleEmail, setKindleEmail] = useState('')

  const handleSubmit = useCallback(async () => {
    try {
      await forgeAPI.entries.sendToKindle
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
    <Stack minWidth="50vw">
      <ModalHeader
        icon="tabler:brand-amazon"
        title="Send to Kindle"
        onClose={onClose}
      />
      <WithQuery query={enabledQuery}>
        {enabled =>
          enabled ? (
            <Stack>
              <TextInput
                required
                icon="tabler:mail"
                inputMode="email"
                label="Kindle Email"
                placeholder="johndoe@kindle.com"
                value={kindleEmail}
                onChange={setKindleEmail}
                onKeyDown={handleKeyDown}
              />
              <Button
                disabled={!kindleEmail.match(/^[\w-.]+@kindle\.com$/)}
                icon="tabler:send"
                iconPosition="end"
                loading={loading}
                onClick={onSubmit}
              >
                Send to Kindle
              </Button>
            </Stack>
          ) : (
            <EmptyStateScreen
              icon="tabler:send-off"
              message={{
                id: 'noSMTPKeys'
              }}
            />
          )
        }
      </WithQuery>
    </Stack>
  )
}

export default SendToKindleModal
