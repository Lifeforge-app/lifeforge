import { APIOnlineStatusWrapper } from 'lifeforge-ui'
import {
  APIOnlineStatusProvider,
  BackgroundProvider,
  PersonalizationProvider,
  SidebarStateProvider,
  ToastProvider
} from 'shared'

import { MusicProvider } from '@apps/Music/providers/MusicProvider'

import AuthProvider from './AuthProvider'
import SocketProvider from './SocketProvider'
import UserPersonalizationProvider from './UserPersonalizationProvider'

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <APIOnlineStatusProvider>
      <APIOnlineStatusWrapper>
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
      </APIOnlineStatusWrapper>
    </APIOnlineStatusProvider>
  )
}

export default Providers
