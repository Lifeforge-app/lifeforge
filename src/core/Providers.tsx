import { CoreProviders } from '@lifeforge/core'

import { MusicProvider } from '@apps/Music/providers/MusicProvider'

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CoreProviders>
      <MusicProvider>{children}</MusicProvider>
    </CoreProviders>
  )
}

export default Providers
