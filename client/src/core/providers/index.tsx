import {
  APIOnlineStatusProvider,
  BackgroundProvider,
  PersonalizationProvider,
  SidebarStateProvider,
  ToastProvider
} from 'shared/lib'

import { MusicProvider } from '@apps/Music/providers/MusicProvider'

import AuthProvider from './AuthProvider'
import SocketProvider from './SocketProvider'
import UserPersonalizationProvider from './UserPersonalizationProvider'

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <APIOnlineStatusProvider>
      <AuthProvider>
        <SidebarStateProvider>
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
        </SidebarStateProvider>
      </AuthProvider>
    </APIOnlineStatusProvider>
  )
}

export default Providers
