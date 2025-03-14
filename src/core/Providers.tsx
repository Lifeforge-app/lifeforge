// Providers.tsx
import APIOnlineStatusProvider from '@providers/APIOnlineStatusProvider'
import AuthProvider from '@providers/AuthProvider'
import BackgroundProvider from '@providers/BackgroundProvider'
import LifeforgeUIProviderWrapper from '@providers/LifeforgeUIProviderWrapper'
import PersonalizationProvider from '@providers/PersonalizationProvider'
import SidebarStateProvider from '@providers/SidebarStateProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { MusicProvider } from '@modules/Music/providers/MusicProvider'

const queryClient = new QueryClient()

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <APIOnlineStatusProvider>
        <SidebarStateProvider>
          <AuthProvider>
            <DndProvider backend={HTML5Backend}>
              <PersonalizationProvider>
                <LifeforgeUIProviderWrapper>
                  <BackgroundProvider>
                    <MusicProvider>{children}</MusicProvider>
                  </BackgroundProvider>
                </LifeforgeUIProviderWrapper>
              </PersonalizationProvider>
            </DndProvider>
          </AuthProvider>
        </SidebarStateProvider>
      </APIOnlineStatusProvider>
    </QueryClientProvider>
  )
}

export default Providers
