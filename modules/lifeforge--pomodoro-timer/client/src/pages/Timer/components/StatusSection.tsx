import _ from 'lodash'

import { useModuleTranslation } from '@lifeforge/localization'
import { Icon } from '@lifeforge/ui'

import { useSessionStyles } from '@/hooks/useSessionStyles'
import { useCurrentSession } from '@/providers/CurrentSessionProvider'
import { usePomodoro } from '@/providers/PomodoroProvider'

function StatusSection() {
  const timer = usePomodoro()
  const currentSession = useCurrentSession()
  const { t } = useModuleTranslation()
  const sessionStyles = useSessionStyles()

  const sessionsUntilLongBreak = currentSession
    ? currentSession.session.session_until_long_break
    : 0

  const getMessage = () => {
    if (timer.subSessionType === 'work') {
      if (!timer.isRunning) return t('timer.messages.readyToFocus')
      if (timer.isRunning) return t('timer.messages.stayFocused')

      return t('timer.messages.paused')
    }

    return t('timer.messages.takeBreak')
  }

  return (
    <>
      <p className="text-lg font-medium">
        {t('timer.cycleCount', {
          current:
            Math.floor(
              (timer.pomodoroCount +
                (timer.subSessionType === 'long_break' ? -1 : 0)) /
                sessionsUntilLongBreak
            ) + 1
        })}
      </p>
      <div
        className="flex items-center gap-3 rounded-full py-2 pr-5 pl-2"
        style={{
          backgroundColor: sessionStyles[timer.subSessionType].color + '15',
          border: `1px solid ${sessionStyles[timer.subSessionType].color}40`
        }}
      >
        <div
          className="rounded-full p-1.5"
          style={{
            backgroundColor: sessionStyles[timer.subSessionType].color + '30'
          }}
        >
          <Icon
            className="size-5"
            icon={sessionStyles[timer.subSessionType].icon}
            style={{ color: sessionStyles[timer.subSessionType].color }}
          />
        </div>
        <span
          className="text-lg font-semibold"
          style={{ color: sessionStyles[timer.subSessionType].color }}
        >
          {t(`timer.${_.camelCase(timer.subSessionType)}`)}
        </span>
      </div>
      <p className="text-bg-500">{getMessage()}</p>
    </>
  )
}

export default StatusSection
