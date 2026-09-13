import { useMemo } from 'react'

import { usePomodoroSettings } from '@/providers/PomodoroSettingsProvider'
import type { SubSessionType } from '@/utils/localStorage'

export interface SessionStyle {
  icon: string
  color: string
}

export type SessionStyles = Record<SubSessionType, SessionStyle>

const SESSION_ICONS: Record<SubSessionType, string> = {
  work: 'tabler:flame',
  short_break: 'tabler:coffee',
  long_break: 'tabler:beach'
}

export function useSessionStyles(): SessionStyles {
  const settings = usePomodoroSettings()

  return useMemo(
    () => ({
      work: {
        icon: SESSION_ICONS.work,
        color: settings.work_color
      },
      short_break: {
        icon: SESSION_ICONS.short_break,
        color: settings.short_break_color
      },
      long_break: {
        icon: SESSION_ICONS.long_break,
        color: settings.long_break_color
      }
    }),
    [settings.work_color, settings.short_break_color, settings.long_break_color]
  )
}

// For use outside of React components or where settings aren't available
export const DEFAULT_SESSION_STYLES: SessionStyles = {
  work: {
    icon: SESSION_ICONS.work,
    color: '#f87171'
  },
  short_break: {
    icon: SESSION_ICONS.short_break,
    color: '#34d399'
  },
  long_break: {
    icon: SESSION_ICONS.long_break,
    color: '#60a5fa'
  }
}
