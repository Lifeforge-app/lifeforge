// Providers.tsx
import React from 'react'
import AuthProvider from '@providers/AuthProvider'
import GlobalStateProvider from '@providers/GlobalStateProvider'
import { MusicProvider } from '@providers/MusicProvider'
import PersonalizationProvider from '@providers/PersonalizationProvider'
import SpotifyProvider from '@providers/SpotifyProvider'

function Providers({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <GlobalStateProvider>
      <AuthProvider>
        <PersonalizationProvider>
          <MusicProvider>
            <SpotifyProvider>{children}</SpotifyProvider>
          </MusicProvider>
        </PersonalizationProvider>
      </AuthProvider>
    </GlobalStateProvider>
  )
}

export default Providers
