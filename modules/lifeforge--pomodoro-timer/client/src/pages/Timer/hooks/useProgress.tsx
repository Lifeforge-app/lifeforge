import { useCurrentSession } from '@/providers/CurrentSessionProvider'
import { usePomodoro } from '@/providers/PomodoroProvider'

function useProgress() {
  const timer = usePomodoro()
  const currentSession = useCurrentSession()

  const totalDuration = currentSession
    ? currentSession.session[
        (
          {
            work: 'work_duration',
            short_break: 'short_break_duration',
            long_break: 'long_break_duration'
          } as const
        )[timer.subSessionType]
      ] * 60
    : 0

  return ((totalDuration - timer.timeLeft) / totalDuration) * 100
}

export default useProgress
