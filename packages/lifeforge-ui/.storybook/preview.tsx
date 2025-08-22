import {
  Canvas,
  Controls,
  Description,
  Primary,
  Stories,
  Subtitle,
  Title
} from '@storybook/addon-docs/blocks'
import type { Preview } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import {
  APIEndpointProvider,
  PersonalizationProvider,
  usePersonalization
} from 'shared'
import { themes } from 'storybook/theming'

import ModalManager from '../src/components/modals/core/ModalManager'
import './i18n'
import './index.css'

const queryClient = new QueryClient()

function MainElement({
  theme,
  children
}: {
  theme: string
  children: React.ReactNode
}) {
  const { setTheme } = usePersonalization()

  useEffect(() => {
    setTheme(theme as 'light' | 'dark')
  }, [theme, setTheme])

  return (
    <main className="flex-center w-full flex-1 flex-col" id="app">
      {children}
      <ModalManager />
    </main>
  )
}

const withBodyClass = (Story: any, context: any) => {
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const body = document.getElementById('body')
    if (!body) return

    body.classList.remove(
      'bg-bg-950!',
      'text-bg-50',
      'bg-bg-200/50!',
      'text-bg-800'
    )

    body.classList.add(
      'flex',
      'items-center',
      'justify-center',
      'theme-custom',
      'h-full',
      'transition-all',
      'flex',
      'flex-col',
      ...(context.globals.theme === 'dark'
        ? ['bg-bg-950!', 'text-bg-50']
        : ['bg-bg-200/50!', 'text-bg-800'])
    )

    document.querySelectorAll('html, body').forEach(html => {
      html.classList.add('h-full')
    })
  }, [context.globals.theme])

  useEffect(() => {
    setRootElement(document.getElementById('body'))
  }, [])

  return (
    <APIEndpointProvider endpoint={'https://lifeforge-api-proxy.onrender.com'}>
      <QueryClientProvider client={queryClient}>
        <div id="body" className="flex-center h-full flex-col transition-all">
          {rootElement && (
            <PersonalizationProvider
              defaultValueOverride={{
                rawThemeColor: '#a9d066',
                theme: context.globals.theme,
                rootElement: rootElement
              }}
            >
              <MainElement theme={context.globals.theme}>
                <Story />
              </MainElement>
            </PersonalizationProvider>
          )}
        </div>
      </QueryClientProvider>
    </APIEndpointProvider>
  )
}

const preview: Preview = {
  parameters: {
    toolbar: {
      hidden: ['DARK_MODE', 'zoom', 'grid']
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      },
      expanded: true
    },
    docs: {
      theme: themes.dark,
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls sort="requiredFirst" />
          <Stories />
        </>
      )
    }
  },
  decorators: [withBodyClass],
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Light / Dark mode',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          {
            value: 'light',
            title: 'Light Mode',
            icon: 'sun'
          },
          {
            value: 'dark',
            title: 'Dark Mode',
            icon: 'moon'
          }
        ],
        showName: true,
        dynamicTitle: true
      }
    }
  },
  tags: ['autodocs'],
  initialGlobals: {
    theme: 'light'
  }
}

export default preview
