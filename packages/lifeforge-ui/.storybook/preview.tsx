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
import { APIEndpointProvider, PersonalizationProvider } from 'shared'
import { themes } from 'storybook/theming'

import ModalManager from '../src/components/modals/core/ModalManager'
import './i18n'
import './index.css'

const queryClient = new QueryClient()

const withBodyClass = (Story: any, context: any) => {
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const body = document.getElementById('body')
    if (!body) return

    body.classList.remove(
      'bg-bg-50!',
      'bg-bg-900!',
      'text-bg-800!',
      'text-bg-100!'
    )
    body.classList.add(
      'flex',
      'items-center',
      'justify-center',
      'theme-blue',
      'bg-zinc',
      'h-full',
      'transition-all',
      'flex',
      'flex-col',
      ...(context.globals.theme === 'dark'
        ? ['bg-bg-900!', 'text-bg-100!']
        : ['bg-bg-50!', 'text-bg-800!'])
    )

    document.querySelectorAll('html, body').forEach(html => {
      html.classList.add('h-full')
    })

    if (context.globals.theme === 'dark') {
      body.classList.add('dark')
    } else {
      body.classList.remove('dark')
    }
  }, [context.globals.theme])

  useEffect(() => {
    setRootElement(document.getElementById('body'))
  }, [])

  return (
    <APIEndpointProvider endpoint={'https://lifeforge-api-proxy.onrender.com'}>
      <QueryClientProvider client={queryClient}>
        <div id="body">
          <PersonalizationProvider
            defaultValueOverride={{
              rawThemeColor: 'theme-blue',
              rootElement: rootElement
            }}
          >
            <main className="flex w-full flex-1 flex-col bg-white" id="app">
              <div
                className={`bg-zinc theme-blue flex w-full flex-1 items-center justify-center py-12 transition-all ${
                  context.globals.theme === 'dark' ? 'dark' : ''
                } ${context.globals.theme === 'dark' ? 'bg-bg-900' : 'bg-bg-200/50'}`}
              >
                <Story />
                <ModalManager />
              </div>
            </main>
          </PersonalizationProvider>
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
