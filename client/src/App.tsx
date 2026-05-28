import { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { ErrorScreen, Flex, ModalProvider, Text } from '@lifeforge/ui'

import './i18n'
import './index.css'
import Providers from './providers'

// @ts-expect-error - VITE_API_HOST is injected at build time
window.VITE_API_HOST = import.meta.env.VITE_API_HOST

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
      <Text
        asChild
        color={{
          base: 'bg-800',
          dark: 'bg-100'
        }}
      >
        <Flex
          as="main"
          bg={{
            base: 'bg-100'
          }}
          className="bg-bg-200/50 dark:bg-bg-900/50"
          height="100dvh"
          id="app"
          overflow="hidden"
          width="100%"
        >
          <ModalProvider>
            <Providers />
          </ModalProvider>
        </Flex>
      </Text>
    </ErrorBoundary>
  )
}

export default App
