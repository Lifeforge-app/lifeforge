import { useModuleTranslation } from '@lifeforge/localization'
import {
  Alert,
  Button,
  Flex,
  ModalHeader,
  Stack,
  Text,
  toast
} from '@lifeforge/ui'

function ShowRecoveryKeyModal({
  data: { recoveryKey },
  onClose
}: {
  data: { recoveryKey: string }
  onClose: () => void
}) {
  const { t } = useModuleTranslation()

  return (
    <>
      <ModalHeader
        icon="tabler:key"
        namespace="apps.passwords"
        title="recovery.display"
        onClose={onClose}
      />
      <Stack gap="md">
        <Alert type="caution">{t('alerts.saveRecoveryKey')}</Alert>
        <Flex align="center" as="code" bg="bg-800" p="md" r="md">
          <Text
            as="code"
            size="lg"
            style={{ userSelect: 'text' }}
            tracking="wider"
            wordBreak="break-all"
          >
            {recoveryKey}
          </Text>
        </Flex>
        <Flex gap="sm">
          <Button
            flex="1"
            icon="tabler:copy"
            tProps={{ item: 'Copy' }}
            variant="secondary"
            onClick={() => {
              navigator.clipboard.writeText(recoveryKey)
              toast.success(t('toasts.recoveryKeyCopied'))
            }}
          >
            copyRecoveryKey
          </Button>
          <Button
            flex="1"
            icon="tabler:download"
            tProps={{ item: 'Download' }}
            variant="secondary"
            onClick={() => {
              const blob = new Blob([recoveryKey], { type: 'text/plain' })
              const url = URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.href = url
              link.download = 'lifeforge-password-vault-recovery-key.txt'
              link.click()
              URL.revokeObjectURL(url)
            }}
          >
            downloadRecoveryKey
          </Button>
        </Flex>
        <Button icon="tabler:check" onClick={onClose}>
          closeRecoveryKey
        </Button>
      </Stack>
    </>
  )
}

export default ShowRecoveryKeyModal
