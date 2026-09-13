import { useModuleTranslation } from '@lifeforge/localization'

import { useSessionStyles } from '@/hooks/useSessionStyles'
import { useCurrentSession } from '@/providers/CurrentSessionProvider'
import { usePomodoro } from '@/providers/PomodoroProvider'

import useProgress from '../hooks/useProgress'

function ProgressBars() {
  const currentSession = useCurrentSession()
  const timer = usePomodoro()
  const progress = useProgress()
  const { t } = useModuleTranslation()
  const sessionStyles = useSessionStyles()

  const currentPomodoroInCycle = currentSession
    ? timer.pomodoroCount % currentSession.session.session_until_long_break
    : 0

  if (!currentSession) {
    return null
  }

  return (
    <>
      <div className="flex w-full max-w-md items-center gap-1">
        {Array.from({
          length: currentSession.session.session_until_long_break * 2
        }).map((_, i) => {
          const isWorkSegment = i % 2 === 0

          const workIndex = Math.floor(i / 2)

          const restIndex = Math.floor(i / 2)

          if (isWorkSegment) {
            const isCompleted =
              workIndex < currentPomodoroInCycle ||
              timer.subSessionType === 'long_break'

            const isCurrent =
              workIndex === currentPomodoroInCycle &&
              timer.subSessionType === 'work'

            const segmentProgress = isCurrent ? progress : 0

            return (
              <div
                key={i}
                className="bg-bg-200 dark:bg-bg-800 relative h-2 flex-[2] overflow-hidden rounded-full first:rounded-l-full"
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                  style={{
                    width: isCompleted ? '100%' : `${segmentProgress}%`,
                    backgroundColor: sessionStyles.work.color
                  }}
                />
              </div>
            )
          }

          const isLongBreak =
            restIndex === currentSession.session.session_until_long_break - 1

          const breakType = isLongBreak ? 'long_break' : 'short_break'

          const adjustedRestIndex =
            (currentPomodoroInCycle -
              1 +
              currentSession.session.session_until_long_break) %
            currentSession.session.session_until_long_break

          const isRestCompleted =
            timer.subSessionType === 'work'
              ? restIndex < currentPomodoroInCycle
              : restIndex < adjustedRestIndex

          const isRestCurrent =
            restIndex === adjustedRestIndex && timer.subSessionType !== 'work'

          const segmentProgress = isRestCurrent ? progress : 0

          return (
            <div
              key={i}
              className="bg-bg-200 dark:bg-bg-800 relative h-2 flex-1 overflow-hidden rounded-full last:rounded-r-full"
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                style={{
                  width: isRestCompleted ? '100%' : `${segmentProgress}%`,
                  backgroundColor: sessionStyles[breakType].color
                }}
              />
            </div>
          )
        })}
      </div>
      <span className="text-bg-500">
        {timer.subSessionType === 'work'
          ? t('timer.pomodoroCount', {
              current:
                currentPomodoroInCycle +
                (timer.subSessionType === 'work' ? 1 : 0),
              total: currentSession.session.session_until_long_break
            })
          : t('timer.breakingTime')}
      </span>
    </>
  )
}

export default ProgressBars
