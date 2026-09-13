import { Button } from '@lifeforge/ui'

import { usePomodoro } from '@/providers/PomodoroProvider'

function ControlButtons() {
  const timer = usePomodoro()

  return (
    <div className="mt-6 flex items-center gap-3">
      {!timer.isRunning ? (
        <Button
          icon="tabler:player-play"
          variant="primary"
          onClick={timer.start}
        >
          start
        </Button>
      ) : (
        <Button
          icon="tabler:player-pause"
          variant="primary"
          onClick={timer.pause}
        >
          pause
        </Button>
      )}
      <Button
        disabled={timer.isRunning}
        icon="tabler:refresh"
        variant="secondary"
        onClick={timer.reset}
      >
        reset
      </Button>
      {timer.subSessionType !== 'work' && (
        <Button
          disabled={timer.isRunning}
          icon="tabler:player-skip-forward"
          variant="secondary"
          onClick={timer.skip}
        >
          skip
        </Button>
      )}
    </div>
  )
}

export default ControlButtons
