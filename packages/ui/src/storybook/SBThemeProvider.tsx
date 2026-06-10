/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ReactNode, useMemo } from 'react'

import { forgeAPI } from '@/utils/forgeAPI'

import { PersonalizationProvider } from '../providers'
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
    const existingGlobals = context?.globals || {}

    return {
      ...context,
      globals: {
        ...existingGlobals,
        rawThemeColor: deriveFinalValue(existingGlobals.themeColor, '#a9d066'),
        theme: deriveFinalValue(existingGlobals.theme, 'light'),
        fontScale: deriveFinalValue(existingGlobals.fontScale, 1),
        bgTemp: deriveFinalValue(existingGlobals.bgTemp, 'bg-zinc')
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
