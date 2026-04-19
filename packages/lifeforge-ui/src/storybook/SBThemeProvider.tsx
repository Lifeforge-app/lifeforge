/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ReactNode, useMemo } from 'react'
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
  const derivedContext = useMemo(() => {
    return {
      ...context,
      globals: {
        ...context.globals,
        themeColor: deriveFinalValue(context.globals.themeColor, '#a9d066'),
        theme: deriveFinalValue(context.globals.theme, 'light'),
        fontScale: deriveFinalValue(context.globals.fontScale, 1),
        bgTemp: deriveFinalValue(context.globals.bgTemp, 'bg-zinc')
      }
    }
  }, [context])

  useSBTheme(derivedContext)

  return (
    <PersonalizationProvider
      // Force remount when theme changes
      key={`${derivedContext.globals.themeColor}-${derivedContext.globals.fontScale}-${derivedContext.globals.bgTemp}-${derivedContext.globals.theme}`}
      defaultValueOverride={{
        rootElement: document.body,
        ...derivedContext.globals
      }}
      forgeAPI={forgeAPI}
    >
      {children}
    </PersonalizationProvider>
  )
}
