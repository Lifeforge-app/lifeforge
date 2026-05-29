import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Stack, Text } from '@lifeforge/ui'

import OTPConfirmScreen from './OTPConfirmScreen'
import QRCodeDisplay from './QRCodeDisplay'

function TwoFAEnableProcedure({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useTranslation('common.accountSettings')

  const [proceeded, setProceeded] = useState(false)

  return proceeded ? (
    <OTPConfirmScreen onSuccess={onSuccess} />
  ) : (
    <Stack gap="lg">
      <Text as="p" color="muted">
        {t('modals.enable2FA.description')}
      </Text>
      <QRCodeDisplay />
      <Button
        icon="tabler:arrow-right"
        iconPosition="end"
        mt="lg"
        width="100%"
        onClick={() => {
          setProceeded(true)
        }}
      >
        Proceed
      </Button>
    </Stack>
  )
}

export default TwoFAEnableProcedure
