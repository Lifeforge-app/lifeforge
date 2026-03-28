/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ReactNode } from 'react'
import { PersonalizationProvider } from 'shared'

import forgeAPI from '@/utils/forgeAPI'

import { useSBTheme } from './useSBTheme'

function deriveFinalValue(value: any, fallback: any) {
  if (value === '_reset' || value === undefined) return fallback

  return value
}

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
        rawThemeColor: deriveFinalValue(context.globals.themeColor, '#a9d066'),
        theme: context.globals.theme,
        rootElement: document.body,
        fontScale: deriveFinalValue(context.globals.fontScale, 1),
        bgTemp: deriveFinalValue(context.globals.bgTemp, 'bg-zinc')
      }}
      forgeAPI={forgeAPI}
    >
      {children}
    </PersonalizationProvider>
  )
}
