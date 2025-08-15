import { Button } from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import OTPConfirmScreen from './OTPConfirmScreen'
import QRCodeDisplay from './QRCodeDisplay'

function TwoFAEnableProcedure({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useTranslation('core.accountSettings')

  const [proceeded, setProceeded] = useState(false)

  return proceeded ? (
    <OTPConfirmScreen onSuccess={onSuccess} />
  ) : (
    <div>
      <p className="text-bg-500 max-w-[30rem]">
        {t('modals.enable2FA.description')}
      </p>
      <QRCodeDisplay />
      <Button
        iconPosition="end"
        className="mt-6 w-full"
        icon="tabler:arrow-right"
        onClick={() => {
          setProceeded(true)
        }}
      >
        Proceed
      </Button>
    </div>
  )
}

export default TwoFAEnableProcedure
