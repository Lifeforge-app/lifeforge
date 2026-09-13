import { useAuth } from '@lifeforge/api'

import ActiveSessionProvider from './ActiveSessionProvider'
import CurrentSessionProvider from './CurrentSessionProvider'
import PomodoroProvider from './PomodoroProvider'
import PomodoroSettingsProvider from './PomodoroSettingsProvider'

function PomodoroProviders({ children }: { children: React.ReactNode }) {
  const { auth } = useAuth()

  if (!auth) {
    return children
  }

  return (
    <ActiveSessionProvider>
      <PomodoroSettingsProvider>
        <CurrentSessionProvider>
          <PomodoroProvider>{children}</PomodoroProvider>
        </CurrentSessionProvider>
      </PomodoroSettingsProvider>
    </ActiveSessionProvider>
  )
}

export default PomodoroProviders
