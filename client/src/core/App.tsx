import AuthProvider from '@providers/AuthProvider'
import SocketProvider from '@providers/SocketProvider'
import UserPersonalizationProvider from '@providers/UserPersonalizationProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorScreen } from 'lifeforge-ui'
import { APIOnlineStatusWrapper } from 'lifeforge-ui'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ErrorBoundary } from 'react-error-boundary'
import {
  APIEndpointProvider,
  APIOnlineStatusProvider,
  BackgroundProvider,
  PersonalizationProvider,
  SidebarStateProvider,
  ToastProvider
} from 'shared'

import { MusicProvider } from '@apps/04.Storage/music/providers/MusicProvider'

import './i18n'
import './index.css'
import AppRoutesProvider from './routes/providers/AppRoutesProvider'
import './utils/extendDayJs'

const queryClient = new QueryClient()

function App() {
  useEffect(() => {
    const preloader = document.querySelector('.preloader')

    if (preloader) {
      preloader.remove()
    }
  }, [])

  return (
    <ErrorBoundary
      fallback={<ErrorScreen message="An unexpected error occurred." />}
    >
      <NuqsAdapter>
        <main
          className="bg-bg-200/50 dark:bg-bg-900/50 text-bg-800 dark:text-bg-50 flex h-dvh w-full overflow-hidden"
          id="app"
        >
          <APIEndpointProvider endpoint={import.meta.env.VITE_API_HOST}>
            <QueryClientProvider client={queryClient}>
              <DndProvider backend={HTML5Backend}>
                <PersonalizationProvider>
                  <APIOnlineStatusProvider>
                    <APIOnlineStatusWrapper>
                      <AuthProvider>
                        <SidebarStateProvider>
                          <UserPersonalizationProvider>
                            <ToastProvider>
                              <BackgroundProvider>
                                <SocketProvider>
                                  <MusicProvider>
                                    <AppRoutesProvider />
                                  </MusicProvider>
                                </SocketProvider>
                              </BackgroundProvider>
                            </ToastProvider>
                          </UserPersonalizationProvider>
                        </SidebarStateProvider>
                      </AuthProvider>
                    </APIOnlineStatusWrapper>
                  </APIOnlineStatusProvider>
                </PersonalizationProvider>
              </DndProvider>
            </QueryClientProvider>
          </APIEndpointProvider>
        </main>
      </NuqsAdapter>
    </ErrorBoundary>
  )
}

export default App
