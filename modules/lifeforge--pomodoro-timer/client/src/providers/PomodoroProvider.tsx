import {
  type SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

import { forgeAPI } from '@/manifest'
import { useCurrentSession } from '@/providers/CurrentSessionProvider'
import {
  type LocalSubSession,
  type LocalTimerState,
  type SubSessionType,
  clearLocalTimerState,
  getLocalTimerState,
  initializeLocalTimerState,
  saveLocalTimerState
} from '@/utils/localStorage'

import { usePomodoroSettings } from './PomodoroSettingsProvider'

interface TimerState {
  timeLeft: number
  isRunning: boolean
  subSessionType: SubSessionType
  pomodoroCount: number
  sessionKey: number
  subSessions: LocalSubSession[]
  currentSubSessionStarted: string
}

interface PomodoroContext extends TimerState {
  start: () => void
  pause: () => void
  reset: () => void
  skip: () => void
  endSession: () => Promise<void>
}

const PomodoroContext = createContext<PomodoroContext | null>(null)

function PomodoroProvider({ children }: { children: React.ReactNode }) {
  const settings = usePomodoroSettings()
  const settingsRef = useRef(settings)

  // Keep settingsRef up to date
  useEffect(() => {
    settingsRef.current = settings
  }, [settings])

  const currentSession = useCurrentSession()

  // Initialize state from localStorage or session data
  const getInitialState = useCallback((): TimerState => {
    if (!currentSession) {
      return {
        timeLeft: 0,
        isRunning: false,
        subSessionType: 'work',
        pomodoroCount: 0,
        sessionKey: 0,
        subSessions: [],
        currentSubSessionStarted: new Date().toISOString()
      }
    }

    const stored = getLocalTimerState()

    // If we have stored state for this session, restore it
    if (stored && stored.sessionId === currentSession.session.id) {
      return {
        timeLeft: stored.timeLeft,
        isRunning: false, // Always start paused after restore
        subSessionType: stored.subSessionType,
        pomodoroCount: stored.pomodoroCount,
        sessionKey: stored.sessionKey,
        subSessions: stored.subSessions,
        currentSubSessionStarted: stored.currentSubSessionStarted
      }
    }

    // Initialize fresh state for new session
    const freshState = initializeLocalTimerState(
      currentSession.session.id,
      currentSession.session
    )

    return {
      timeLeft: freshState.timeLeft,
      isRunning: false,
      subSessionType: freshState.subSessionType,
      pomodoroCount: freshState.pomodoroCount,
      sessionKey: freshState.sessionKey,
      subSessions: freshState.subSessions,
      currentSubSessionStarted: freshState.currentSubSessionStarted
    }
  }, [currentSession])

  const [state, _setState] = useState<TimerState>(getInitialState)
  const stateRef = useRef(state)

  const setState = useCallback((newState: SetStateAction<TimerState>) => {
    stateRef.current =
      typeof newState === 'function'
        ? { ...stateRef.current, ...newState(stateRef.current) }
        : { ...stateRef.current, ...newState }
    _setState(stateRef.current)
  }, [])

  const intervalRef = useRef<number | null>(null)

  // Persist to localStorage whenever state changes
  useEffect(() => {
    if (!currentSession) return

    const localState: LocalTimerState = {
      sessionId: currentSession.session.id,
      timeLeft: state.timeLeft,
      isRunning: state.isRunning,
      subSessionType: state.subSessionType,
      pomodoroCount: state.pomodoroCount,
      subSessions: state.subSessions,
      currentSubSessionStarted: state.currentSubSessionStarted,
      sessionKey: state.sessionKey
    }

    saveLocalTimerState(localState)
  }, [currentSession, state])

  const start = useCallback(() => {
    if (state.isRunning) return
    setState(prev => ({ ...prev, isRunning: true }))
  }, [state.isRunning, setState])

  const pause = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setState(prev => ({ ...prev, isRunning: false }))
  }, [setState])

  const reset = useCallback(() => {
    if (state.isRunning || !currentSession) return

    const duration =
      currentSession.session[
        (
          {
            work: 'work_duration',
            short_break: 'short_break_duration',
            long_break: 'long_break_duration'
          } as const
        )[state.subSessionType]
      ] * 60

    setState(prev => ({ ...prev, timeLeft: duration }))
  }, [state.isRunning, state.subSessionType, currentSession, setState])

  const nextSubSession = useCallback(
    (currentState: TimerState, autoStart: boolean, isFinished: boolean) => {
      if (!currentSession) return

      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      // Calculate duration of completed subsession
      const fullDuration =
        currentSession.session[
          (
            {
              work: 'work_duration',
              short_break: 'short_break_duration',
              long_break: 'long_break_duration'
            } as const
          )[currentState.subSessionType]
        ] * 60

      const durationElapsed = isFinished
        ? fullDuration
        : fullDuration - currentState.timeLeft

      // Record completed subsession locally
      const completedSubSession: LocalSubSession = {
        type: currentState.subSessionType,
        duration_elapsed: durationElapsed,
        ended: new Date().toISOString(),
        is_completed: isFinished
      }

      // Determine next subsession type
      let newType: SubSessionType
      let newPomodoros = currentState.pomodoroCount

      if (currentState.subSessionType === 'work') {
        newPomodoros += 1

        if (
          newPomodoros % currentSession.session.session_until_long_break ===
          0
        ) {
          newType = 'long_break'
        } else {
          newType = 'short_break'
        }
      } else {
        newType = 'work'
      }

      const newDuration =
        currentSession.session[
          (
            {
              work: 'work_duration',
              short_break: 'short_break_duration',
              long_break: 'long_break_duration'
            } as const
          )[newType]
        ] * 60

      setState({
        timeLeft: newDuration,
        isRunning: autoStart,
        subSessionType: newType,
        pomodoroCount: newPomodoros,
        sessionKey: currentState.sessionKey + 1,
        subSessions: [...currentState.subSessions, completedSubSession],
        currentSubSessionStarted: new Date().toISOString()
      })
    },
    [currentSession, setState]
  )

  const skip = useCallback(() => {
    if (
      state.isRunning ||
      state.timeLeft === 0 ||
      state.subSessionType === 'work'
    ) {
      return
    }

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    setState(prev => ({ ...prev, isRunning: false }))
    nextSubSession(stateRef.current, settings.auto_start_work ?? false, false)
  }, [
    state.isRunning,
    state.timeLeft,
    state.subSessionType,
    settings,
    nextSubSession,
    setState
  ])

  const endSession = useCallback(async () => {
    if (!currentSession) return

    // Calculate current subsession elapsed time
    const fullDuration =
      currentSession.session[
        (
          {
            work: 'work_duration',
            short_break: 'short_break_duration',
            long_break: 'long_break_duration'
          } as const
        )[stateRef.current.subSessionType]
      ] * 60

    const currentElapsed = fullDuration - stateRef.current.timeLeft

    // Add current (incomplete) subsession to the list
    const finalSubSessions: LocalSubSession[] = [
      ...stateRef.current.subSessions,
      {
        type: stateRef.current.subSessionType,
        duration_elapsed: currentElapsed,
        ended: new Date().toISOString(),
        is_completed: false
      }
    ]

    // Sync to database
    await currentSession.changeStatus('completed', stateRef.current.timeLeft, {
      subSessions: finalSubSessions,
      pomodoroCount: stateRef.current.pomodoroCount
    })

    // Clear localStorage
    clearLocalTimerState()
  }, [currentSession])

  // Timer tick effect
  useEffect(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (state.isRunning) {
      intervalRef.current = window.setInterval(async () => {
        if (stateRef.current.timeLeft === 0) {
          // Play notification sound
          const audio = new Audio(
            forgeAPI.getMedia({
              collectionId: settingsRef.current.collectionId,
              recordId: settingsRef.current.id,
              fieldId: settingsRef.current.notification_sound
            })
          )

          await audio.play().catch(() => {})

          const shouldAutoStart =
            stateRef.current.subSessionType === 'work'
              ? settingsRef.current.auto_start_break
              : settingsRef.current.auto_start_work

          nextSubSession(stateRef.current, shouldAutoStart ?? false, true)

          return
        }

        setState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }))
      }, 1000)
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [state.isRunning, state.sessionKey, nextSubSession, setState])

  return (
    <PomodoroContext
      value={{
        ...state,
        start,
        pause,
        reset,
        skip,
        endSession
      }}
    >
      {children}
    </PomodoroContext>
  )
}

export default PomodoroProvider

export function usePomodoro() {
  const context = useContext(PomodoroContext)

  if (context === null) {
    throw new Error('usePomodoro must be used within a PomodoroProvider')
  }

  return context
}

export type { SubSessionType }
