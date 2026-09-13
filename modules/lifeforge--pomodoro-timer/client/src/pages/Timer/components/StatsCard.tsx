import type { Session } from '@'

import { useModuleTranslation } from '@lifeforge/localization'
import { Card, Icon } from '@lifeforge/ui'

import { useSessionStyles } from '@/hooks/useSessionStyles'
import formatTime from '@/utils/formatTime'

function StatsCard({
  session,
  breakTime
}: {
  session: Session
  breakTime?: number
}) {
  const { t } = useModuleTranslation()
  const sessionStyles = useSessionStyles()

  return (
    <div className="mt-4 flex w-full min-w-0 flex-wrap items-center gap-4 text-left">
      <Card className="component-bg-lighter flex w-full flex-1 items-center gap-3">
        <div
          className="rounded-lg p-3"
          style={{ backgroundColor: sessionStyles.work.color + '20' }}
        >
          <Icon
            className="size-6"
            icon={sessionStyles.work.icon}
            style={{ color: sessionStyles.work.color }}
          />
        </div>
        <div>
          <div className="text-2xl font-medium">{session.pomodoro_count}</div>
          <div className="text-bg-500 font-medium">
            {t('timer.pomodoroCompleted')}
          </div>
        </div>
      </Card>
      <Card className="component-bg-lighter flex w-full flex-1 shrink-0 items-center gap-3">
        <div
          className="rounded-lg p-3"
          style={{ backgroundColor: sessionStyles.work.color + '20' }}
        >
          <Icon
            className="size-6"
            icon="tabler:clock"
            style={{ color: sessionStyles.work.color }}
          />
        </div>
        <div>
          <div className="text-2xl font-medium">
            {formatTime(Number(session.total_time_elapsed))}
          </div>
          <div className="text-bg-500 font-medium">{t('timer.focusTime')}</div>
        </div>
      </Card>
      <Card className="component-bg-lighter flex w-full flex-1 shrink-0 items-center gap-3">
        <div
          className="rounded-lg p-3"
          style={{ backgroundColor: sessionStyles.short_break.color + '20' }}
        >
          <Icon
            className="size-6"
            icon={sessionStyles.short_break.icon}
            style={{ color: sessionStyles.short_break.color }}
          />
        </div>
        <div>
          <div className="text-2xl font-medium">
            {formatTime(breakTime || 0)}
          </div>
          <div className="text-bg-500 font-medium">{t('timer.breakTime')}</div>
        </div>
      </Card>
    </div>
  )
}

export default StatsCard
