import ToastProvider from '@providers/ToastProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import {
  APIEndpointProvider,
  APIOnlineStatusProvider,
  BackgroundProvider,
  PersonalizationProvider,
  SidebarStateProvider
} from 'shared/lib'

import { MusicProvider } from '@apps/Music/providers/MusicProvider'

import AuthProvider from './AuthProvider'
import SocketProvider from './SocketProvider'
import UserPersonalizationProvider from './UserPersonalizationProvider'

const queryClient = new QueryClient()

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <APIEndpointProvider endpoint={import.meta.env.VITE_API_HOST}>
      <QueryClientProvider client={queryClient}>
        <APIOnlineStatusProvider>
          <SidebarStateProvider>
            <AuthProvider>
              <DndProvider backend={HTML5Backend}>
                <PersonalizationProvider>
                  <UserPersonalizationProvider>
                    <ToastProvider>
                      <BackgroundProvider>
                        <SocketProvider>
                          <MusicProvider>{children}</MusicProvider>
                        </SocketProvider>
                      </BackgroundProvider>
                    </ToastProvider>
                  </UserPersonalizationProvider>
                </PersonalizationProvider>
              </DndProvider>
            </AuthProvider>
          </SidebarStateProvider>
        </APIOnlineStatusProvider>
      </QueryClientProvider>
    </APIEndpointProvider>
  )
}

export default Providers
