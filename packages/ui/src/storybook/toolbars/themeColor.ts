import { anyColorToHex } from '@lifeforge/shared'

import { TAILWIND_PALETTE } from '@/system/colors/constants/tailwind-palette'

const PALETTE_NAMES: Record<string, string> = {
  slate: '🩶 Slate',
  gray: '🩶 Gray',
  zinc: '🩶 Zinc',
  neutral: '🩶 Neutral',
  stone: '🪨 Stone',
  mauve: '🟣 Mauve',
  olive: '🫒 Olive',
  mist: '🌫️ Mist',
  taupe: '🟤 Taupe',
  red: '🔴 Red',
  orange: '🟠 Orange',
  amber: '🟠 Amber',
  yellow: '💛 Yellow',
  lime: '🍋 Lime',
  green: '🟢 Green',
  emerald: '💚 Emerald',
  teal: '🍵 Teal',
  cyan: '🥶 Cyan',
  sky: '🔵 Sky',
  blue: '🔵 Blue',
  indigo: '🔷 Indigo',
  violet: '🟣 Violet',
  purple: '🟣 Purple',
  fuchsia: '💗 Fuchsia',
  pink: '🩷 Pink',
  rose: '🌹 Rose'
}

const THEME_COLOR_ITEMS = Object.entries(PALETTE_NAMES).map(
  ([name, title]) => ({
    value: anyColorToHex(
      TAILWIND_PALETTE[name as keyof typeof TAILWIND_PALETTE]['500']
    ),
    title
  })
)

export const THEME_COLOR_TOOLBAR_CONFIG = {
  name: 'Theme Color',
  description: 'Primary theme color',
  defaultValue: TAILWIND_PALETTE.green['500'],
  toolbar: {
    icon: 'paintbrush',
    items: THEME_COLOR_ITEMS,
    showName: true,
    dynamicTitle: true
  }
}
