import { Icon } from '@iconify/react'
import { Button } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

function ConfirmScreen({
  onClose,
  onApprove,
  loading
}: {
  onClose: () => void
  onApprove: () => void
  loading: boolean
}) {
  const { t } = useTranslation('common.auth')

  return (
    <div className="mt-4 flex flex-col items-center gap-4">
      <div className="bg-custom-500/20 flex-center size-20 rounded-lg">
        <Icon className="text-custom-500 size-10" icon="tabler:device-laptop" />
      </div>
      <p className="text-bg-500 mt-2 text-center">
        {t('qrLogin.approvalDescription')}
      </p>
      <div className="mt-4 flex w-full flex-col-reverse gap-2 sm:flex-row">
        <Button
          className="sm:w-1/2"
          icon=""
          variant="secondary"
          onClick={onClose}
        >
          {t('qrLogin.deny')}
        </Button>
        <Button
          className="sm:w-1/2"
          icon="tabler:check"
          loading={loading}
          onClick={onApprove}
        >
          {t('qrLogin.approve')}
        </Button>
      </div>
    </div>
  )
}

export default ConfirmScreen
