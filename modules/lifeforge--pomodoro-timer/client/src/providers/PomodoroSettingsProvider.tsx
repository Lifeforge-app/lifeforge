import { useQuery } from '@tanstack/react-query'
import { createContext, useContext } from 'react'

import type { InferOutput } from '@lifeforge/api'
import { WithQuery } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

export type PomodoroSettings = InferOutput<typeof forgeAPI.settings.get>

const PomodoroSettingsContext = createContext<PomodoroSettings | null>(null)

function PomodoroSettingsProvider({ children }: { children: React.ReactNode }) {
  const settingsQuery = useQuery(forgeAPI.settings.get.queryOptions())

  return (
    <WithQuery query={settingsQuery}>
      {settings => (
        <PomodoroSettingsContext.Provider value={settings}>
          {children}
        </PomodoroSettingsContext.Provider>
      )}
    </WithQuery>
  )
}

export default PomodoroSettingsProvider

export function usePomodoroSettings() {
  const context = useContext(PomodoroSettingsContext)

  if (!context) {
    throw new Error(
      'usePomodoroSettings must be used within a PomodoroSettingsProvider'
    )
  }

  return context
}
