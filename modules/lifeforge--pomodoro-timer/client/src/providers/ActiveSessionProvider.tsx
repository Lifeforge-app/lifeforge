import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useState } from 'react'

import { LoadingScreen, WithQuery } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

interface ActiveSessionContext {
  activeSessionId: string | null
  setActiveSession: (id: string | null) => void
}

const ActiveSessionContext = createContext<ActiveSessionContext | null>(null)

function ActiveSessionProvider({ children }: { children: React.ReactNode }) {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)
  // Fetch sessions list to find any active session
  const sessionsQuery = useQuery(forgeAPI.sessions.list.queryOptions())

  // Auto-detect active session on load
  useEffect(() => {
    if (sessionsQuery.data && !initialized) {
      const activeSession = sessionsQuery.data.find(
        session => session.status === 'active'
      )

      if (activeSession) {
        setActiveSessionId(activeSession.id)
      }

      setInitialized(true)
    }
  }, [sessionsQuery.data, initialized])

  return (
    <WithQuery query={sessionsQuery}>
      {() =>
        !initialized ? (
          <LoadingScreen />
        ) : (
          <ActiveSessionContext.Provider
            value={{
              activeSessionId,
              setActiveSession: setActiveSessionId
            }}
          >
            {children}
          </ActiveSessionContext.Provider>
        )
      }
    </WithQuery>
  )
}

export default ActiveSessionProvider

export function useActiveSession() {
  const context = useContext(ActiveSessionContext)

  if (context === null) {
    throw new Error(
      'useActiveSession must be used within an ActiveSessionProvider'
    )
  }

  return context
}
