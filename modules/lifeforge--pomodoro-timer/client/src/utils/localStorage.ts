export type SubSessionType = 'work' | 'short_break' | 'long_break'

export interface LocalSubSession {
  type: SubSessionType
  duration_elapsed: number
  ended: string
  is_completed: boolean
}

export interface LocalTimerState {
  sessionId: string
  timeLeft: number
  isRunning: boolean
  subSessionType: SubSessionType
  pomodoroCount: number
  subSessions: LocalSubSession[]
  currentSubSessionStarted: string
  sessionKey: number
}

const STORAGE_KEY = 'pomodoroTimer_state'

export function getLocalTimerState(): LocalTimerState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (!stored) return null

    return JSON.parse(stored) as LocalTimerState
  } catch {
    return null
  }
}

export function saveLocalTimerState(state: LocalTimerState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage might be full or unavailable
    console.warn('Failed to save timer state to localStorage')
  }
}

export function clearLocalTimerState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    console.warn('Failed to clear timer state from localStorage')
  }
}

export function initializeLocalTimerState(
  sessionId: string,
  session: {
    work_duration: number
    short_break_duration: number
    long_break_duration: number
    pomodoro_count: number
  }
): LocalTimerState {
  return {
    sessionId,
    timeLeft: session.work_duration * 60,
    isRunning: false,
    subSessionType: 'work',
    pomodoroCount: session.pomodoro_count,
    subSessions: [],
    currentSubSessionStarted: new Date().toISOString(),
    sessionKey: 0
  }
}
