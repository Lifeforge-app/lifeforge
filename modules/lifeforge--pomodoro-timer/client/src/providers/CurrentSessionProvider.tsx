import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useState } from 'react'

import { type InferOutput } from '@lifeforge/api'
import { WithQuery } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import { useActiveSession } from '@/providers/ActiveSessionProvider'
import { type LocalSubSession } from '@/utils/localStorage'

export type Session = InferOutput<typeof forgeAPI.sessions.getById>

interface CurrentSessionContext {
  session: Session
  changeStatus: (
    newStatus: Session['status'],
    timeLeft?: number,
    batchData?: {
      subSessions: LocalSubSession[]
      pomodoroCount: number
    }
  ) => Promise<void>
}

const CurrentSessionContext = createContext<
  CurrentSessionContext | null | false
>(null)

function CurrentSessionProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient()
  const { activeSessionId } = useActiveSession()
  const [initialized, setInitialized] = useState(false)

  // Reset state when activeSessionId changes
  useEffect(() => {
    setInitialized(false)
  }, [activeSessionId])

  const changeStatusMutation = useMutation(
    forgeAPI.sessions.changeStatus
      .input({
        id: activeSessionId || ''
      })
      .mutationOptions({
        onSuccess: data => {
          qc.invalidateQueries({
            queryKey: forgeAPI.sessions.list.key
          })

          qc.setQueryData(
            forgeAPI.sessions.getById.input({
              id: activeSessionId || ''
            }).key,
            data
          )
        }
      })
  )

  const sessionQuery = useQuery(
    forgeAPI.sessions.getById
      .input({
        id: activeSessionId || ''
      })
      .queryOptions({
        enabled: !!activeSessionId
      })
  )

  async function handleChangeStatus(
    newStatus: Session['status'],
    _timeLeft?: number,
    batchData?: {
      subSessions: LocalSubSession[]
      pomodoroCount: number
    }
  ) {
    if (newStatus === 'completed' && batchData) {
      // Batch sync all subsessions to database
      await changeStatusMutation.mutateAsync({
        status: 'completed',
        subSessions: batchData.subSessions,
        pomodoroCount: batchData.pomodoroCount
      })

      // Don't clear active session - Timer will show SessionEndedScreen
      return
    }

    // Simple status change (e.g., new -> active)
    await changeStatusMutation.mutateAsync({
      status: newStatus
    })
  }

  useEffect(() => {
    if (sessionQuery.data && !initialized) {
      setInitialized(true)
    }
  }, [sessionQuery.data, initialized])

  if (!activeSessionId) {
    return (
      <CurrentSessionContext value={false}>{children}</CurrentSessionContext>
    )
  }

  return (
    <WithQuery query={sessionQuery}>
      {session => (
        <CurrentSessionContext
          value={{
            session,
            changeStatus: handleChangeStatus
          }}
        >
          {children}
        </CurrentSessionContext>
      )}
    </WithQuery>
  )
}

export default CurrentSessionProvider

export function useCurrentSession() {
  const context = useContext(CurrentSessionContext)

  if (context === null) {
    throw new Error(
      'useCurrentSession must be used within a CurrentSessionProvider'
    )
  }

  return context
}
