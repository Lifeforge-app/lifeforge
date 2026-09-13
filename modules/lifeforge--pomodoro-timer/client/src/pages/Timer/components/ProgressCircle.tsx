import dayjs from 'dayjs'

import { useSessionStyles } from '@/hooks/useSessionStyles'
import { usePomodoro } from '@/providers/PomodoroProvider'

import useProgress from '../hooks/useProgress'

function ProgressCircle() {
  const timer = usePomodoro()
  const progress = useProgress()
  const sessionStyles = useSessionStyles()

  return (
    <div className="relative">
      <svg className="relative size-96 -rotate-90" viewBox="0 0 200 200">
        {/* Background circle */}
        <circle
          className="text-bg-200 dark:text-bg-800"
          cx="100"
          cy="100"
          fill="none"
          r="85"
          stroke="currentColor"
          strokeWidth="10"
        />
        {/* Progress circle */}
        <circle
          className="transition-all duration-300"
          cx="100"
          cy="100"
          fill="none"
          r="85"
          stroke={sessionStyles[timer.subSessionType].color}
          strokeDasharray={`${(progress / 100) * 534.07} 534.07`}
          strokeLinecap="round"
          strokeWidth="10"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className="text-6xl font-semibold"
          style={{
            color: timer.isRunning
              ? sessionStyles[timer.subSessionType].color
              : undefined
          }}
        >
          {dayjs.duration(timer.timeLeft, 'seconds').format('mm:ss')}
        </div>
      </div>
    </div>
  )
}

export default ProgressCircle
