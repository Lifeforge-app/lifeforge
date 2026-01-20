import { Icon } from '@iconify/react'
import { Button } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

function SuccessScreen({
  onClose,
  browserInfo
}: {
  onClose: () => void
  browserInfo: string
}) {
  const { t } = useTranslation('common.auth')

  return (
    <div className="mt-4 flex flex-col items-center gap-4">
      <div className="flex-center size-20 rounded-lg bg-green-500/20">
        <Icon className="size-10 text-green-500" icon="tabler:check" />
      </div>

      <h3 className="text-xl font-medium">{t('qrLogin.success')}</h3>
      {browserInfo && (
        <p className="text-bg-500 mt-2">
          {t('qrLogin.browserInfo')}: {browserInfo}
        </p>
      )}

      <Button
        className="mt-4 w-full"
        icon="tabler:x"
        variant="secondary"
        onClick={onClose}
      >
        Close
      </Button>
    </div>
  )
}

export default SuccessScreen
