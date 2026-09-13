import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import { type InferOutput } from '@lifeforge/api'

import { forgeAPI } from '@/manifest'
import { useActiveSession } from '@/providers/ActiveSessionProvider'

import SessionList from './pages/SessionList'
import Timer from './pages/Timer'

dayjs.extend(duration)

export type Session = InferOutput<typeof forgeAPI.sessions.list>[number]

export default function PomodoroTimer() {
  const { activeSessionId } = useActiveSession()

  if (activeSessionId) {
    return <Timer />
  }

  return <SessionList />
}
