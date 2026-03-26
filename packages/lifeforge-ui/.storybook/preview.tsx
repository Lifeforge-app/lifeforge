import {
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
import {
  APIEndpointProvider,
  PersonalizationProvider,
  usePersonalization
} from 'shared'
import { ToastProvider } from 'shared'
import { themes } from 'storybook/theming'

import ModalProvider from 'shared/dist/providers/ModalStoreProvider'

import { ModalManager } from '@components/overlays'

import forgeAPI from '@/utils/forgeAPI'

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
  useEffect(() => {
    const body = document.body

    const allBgTemps = [
      'bg-slate',
      'bg-gray',
      'bg-zinc',
      'bg-neutral',
      'bg-stone'
    ]
    body.classList.remove(...allBgTemps)
    if (context.globals.bgTemp) {
      body.classList.add(context.globals.bgTemp)
    }

    document.querySelectorAll('.sbdocs-preview').forEach(preview => {
      preview.classList.remove('bg-black!', 'bg-white!', 'border-bg-800!')

      preview.classList.add(
        context.globals.theme === 'dark' ? 'bg-black!' : 'bg-white!',
        'border-bg-800!'
      )
    })

    const sbDocsPreviews = document.querySelectorAll(
      '.sbdocs-preview .docs-story'
    )
    if (!body) return

    body.classList.remove(
      'bg-bg-900/50!',
      'text-bg-50',
      'bg-bg-200/50!',
      'text-bg-800'
    )

    sbDocsPreviews.forEach(preview => {
      preview.classList.remove(
        'bg-bg-900/50!',
        'text-bg-50',
        'bg-bg-200/50!',
        'text-bg-800'
      )

      preview.classList.add(
        ...(context.globals.theme === 'dark'
          ? ['bg-bg-900/50!', 'text-bg-50']
          : ['bg-bg-200/50!', 'text-bg-800'])
      )
    })

    body.classList.add(
      'flex',
      'theme-custom',
      'h-full',
      'transition-all',
      'flex',
      'flex-col',
      ...(!document.querySelector('#storybook-docs:not([hidden])')
        ? [
            ...(context.globals.theme === 'dark'
              ? ['bg-bg-900/50!', 'text-bg-50']
              : ['bg-bg-200/50!', 'text-bg-800'])
          ]
        : [])
    )

    document.querySelectorAll('html, body').forEach(html => {
      html.classList.add('h-full')
    })

    const html = document.documentElement
    if (!html) return
    html.classList.remove('bg-white!', 'bg-black!')
    html.classList.add(
      context.globals.theme === 'dark' ? 'bg-black!' : 'bg-white!'
    )
  }, [context.globals.theme, context.globals.bgTemp])

  return (
    <APIEndpointProvider endpoint={'https://lifeforge-api-proxy.onrender.com'}>
      <QueryClientProvider client={queryClient}>
        <div id="body" className="flex-center h-full flex-col transition-all">
          <PersonalizationProvider
            key={`${context.globals.themeColor}-${context.globals.fontScale}-${context.globals.bgTemp}`}
            forgeAPI={forgeAPI}
            defaultValueOverride={{
              rawThemeColor: context.globals.themeColor || '#a9d066',
              theme: context.globals.theme,
              rootElement: document.body,
              fontScale: context.globals.fontScale || 1,
              bgTemp: context.globals.bgTemp || 'bg-zinc'
            }}
          >
            <ToastProvider>
              <ModalProvider>
                <MainElement theme={context.globals.theme}>
                  <Story />
                </MainElement>
              </ModalProvider>
            </ToastProvider>
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
      codePanel: true,
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
    },
    themeColor: {
      name: 'Theme Color',
      description: 'Primary theme color',
      defaultValue: '#4caf50',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: '#f44336', title: 'Red', left: '🔴' },
          { value: '#e91e63', title: 'Pink', left: '🩷' },
          { value: '#9c27b0', title: 'Purple', left: '🟣' },
          { value: '#673ab7', title: 'Deep Purple', left: '🔮' },
          { value: '#3f51b5', title: 'Indigo', left: '🔵' },
          { value: '#2196f3', title: 'Blue', left: 'ew' },
          { value: '#03a9f4', title: 'Light Blue', left: '💧' },
          { value: '#00bcd4', title: 'Cyan', left: '🥶' },
          { value: '#009688', title: 'Teal', left: '🍵' },
          { value: '#4caf50', title: 'Green', left: '🟢' },
          { value: '#8bc34a', title: 'Light Green', left: '🌱' },
          { value: '#cddc39', title: 'Lime', left: '🍋' },
          { value: '#ffeb3b', title: 'Yellow', left: '💛' },
          { value: '#ffc107', title: 'Amber', left: 'qh' },
          { value: '#ff9800', title: 'Orange', left: '🟠' },
          { value: '#ff5722', title: 'Deep Orange', left: '🦀' },
          { value: '#795548', title: 'Brown', left: '🪵' },
          { value: '#9e9e9e', title: 'Grey', left: '🩶' },
          { value: 'custom', title: 'Custom Color...' }
        ],
        showName: true,
        dynamicTitle: true
      }
    },
    fontScale: {
      name: 'Font Scale',
      description: 'Font scale',
      defaultValue: 1,
      toolbar: {
        icon: 'grow',
        items: [
          { value: 0.5, title: 'Small', left: '🤏' },
          { value: 1, title: 'Medium', left: '👥' },
          { value: 2, title: 'Large', left: '👥👥' },
          { value: 3, title: 'Extra Large', left: '👥👥👥' }
        ],
        showName: true,
        dynamicTitle: true
      }
    },
    bgTemp: {
      name: 'BG Temp',
      description: 'Background color temperature',
      defaultValue: 'bg-zinc',
      toolbar: {
        icon: 'contrast',
        items: [
          { value: 'bg-slate', title: 'Slate', left: '🪨' },
          { value: 'bg-gray', title: 'Gray', left: '🩶' },
          { value: 'bg-zinc', title: 'Zinc', left: '⚙️' },
          { value: 'bg-neutral', title: 'Neutral', left: '⬜' },
          { value: 'bg-stone', title: 'Stone', left: '🪵' }
        ],
        showName: true,
        dynamicTitle: true
      }
    }
  },
  tags: ['autodocs'],
  initialGlobals: {
    theme: 'light',
    themeColor: '#4caf50',
    fontScale: 1,
    bgTemp: 'bg-zinc'
  }
}

export default preview
