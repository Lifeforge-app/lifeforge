import type { Session } from '@'

import { useModuleTranslation } from '@lifeforge/localization'
import { Button, Icon } from '@lifeforge/ui'

function NewSessionScreen({
  session,
  changeStatus
}: {
  session: Session
  changeStatus: (newStatus: Session['status']) => Promise<void>
}) {
  const { t } = useModuleTranslation()

  return (
    <div className="flex-center flex-1 flex-col">
      <Icon className="text-bg-500 size-24" icon="tabler:clock-bolt" />
      <h2 className="mt-12 mb-4 text-3xl font-medium">
        {session.name || 'New Session'}
      </h2>
      <p className="text-bg-500 mb-6">{t('timer.readyPrompt')}</p>
      <Button
        className="mt-6"
        icon="tabler:play"
        onClick={() => {
          changeStatus('active')
        }}
      >
        Start Pomodoro
      </Button>
    </div>
  )
}

export default NewSessionScreen
