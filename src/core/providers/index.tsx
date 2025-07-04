import APIOnlineStatusProvider from '@providers/APIOnlineStatusProvider'
import BackgroundProvider from '@providers/BackgroundProvider'
import LifeforgeUIProviderWrapper from '@providers/LifeforgeUIProviderWrapper'
import PersonalizationProvider from '@providers/PersonalizationProvider'
import SidebarStateProvider from '@providers/SidebarStateProvider'
import ToastProvider from '@providers/ToastProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { MusicProvider } from '@apps/Music/providers/MusicProvider'

import AuthProvider from './AuthProvider'
import SocketProvider from './SocketProvider'

const queryClient = new QueryClient()

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <APIOnlineStatusProvider>
        <SidebarStateProvider>
          <AuthProvider>
            <DndProvider backend={HTML5Backend}>
              <PersonalizationProvider>
                <ToastProvider>
                  <LifeforgeUIProviderWrapper>
                    <BackgroundProvider>
                      <SocketProvider>
                        <MusicProvider>{children}</MusicProvider>
                      </SocketProvider>
                    </BackgroundProvider>
                  </LifeforgeUIProviderWrapper>
                </ToastProvider>
              </PersonalizationProvider>
            </DndProvider>
          </AuthProvider>
        </SidebarStateProvider>
      </APIOnlineStatusProvider>
    </QueryClientProvider>
  )
}

export default Providers
