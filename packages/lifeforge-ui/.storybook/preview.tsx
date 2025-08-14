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
import { useEffect } from 'react'
import { APIEndpointProvider, PersonalizationProvider } from 'shared'

import ModalManager from '../src/components/modals/core/ModalManager'
import './i18n'
import './index.css'

const queryClient = new QueryClient()

const withBodyClass = (Story: any, context: any) => {
  useEffect(() => {
    document.body.classList.remove(
      'bg-bg-50!',
      'bg-bg-900!',
      'text-bg-800!',
      'text-bg-100!'
    )
    document.body.classList.add(
      'flex',
      'items-center',
      'justify-center',
      'min-h-dvh',
      'theme-blue',
      'bg-zinc',
      'transition-all',
      ...(context.globals.theme === 'dark'
        ? ['bg-bg-900!', 'text-bg-100!']
        : ['bg-bg-50!', 'text-bg-800!'])
    )

    if (context.globals.theme === 'dark') {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }, [context.globals.theme])

  return (
    <APIEndpointProvider endpoint={'https://lifeforge-api-proxy.onrender.com'}>
      <QueryClientProvider client={queryClient}>
        <PersonalizationProvider
          defaultValueOverride={{
            rawThemeColor: 'theme-blue'
          }}
        >
          <main className="flex flex-1 flex-col bg-white" id="app">
            <div
              className={`bg-zinc theme-blue flex w-full flex-1 items-center justify-center py-12 transition-all ${
                context.globals.theme === 'dark' ? 'dark' : ''
              } ${context.globals.theme === 'dark' ? 'bg-bg-900' : 'bg-bg-200/50'}`}
            >
              <Story />
            </div>
          </main>
          <ModalManager />
        </PersonalizationProvider>
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
      toc: true,
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
