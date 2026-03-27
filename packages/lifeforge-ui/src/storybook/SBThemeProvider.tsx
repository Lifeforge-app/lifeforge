/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ReactNode } from 'react'
import { PersonalizationProvider } from 'shared'

import forgeAPI from '@/utils/forgeAPI'

import { useSBTheme } from './useSBTheme'

export function SBThemeProvider({
  children,
  context
}: {
  children: ReactNode
  context: any
}) {
  useSBTheme(context)

  return (
    <PersonalizationProvider
      // Force remount when theme changes
      key={`${context.globals.themeColor}-${context.globals.fontScale}-${context.globals.bgTemp}-${context.globals.theme}`}
      defaultValueOverride={{
        rawThemeColor: context.globals.themeColor || '#a9d066',
        theme: context.globals.theme,
        rootElement: document.body,
        fontScale: context.globals.fontScale || 1,
        bgTemp:
          context.globals.bgTemp === '_reset'
            ? 'bg-zinc'
            : context.globals.bgTemp
      }}
      forgeAPI={forgeAPI}
    >
      {children}
    </PersonalizationProvider>
  )
}
