import { createTabbedView, usePersonalization } from '@lifeforge/ui'

import CustomFontSelector from './custom'
import GoogleFontSelector from './google'

export const FONT_PICKER_TABS = {
  google: {
    icon: 'tabler:brand-google',
    Component: GoogleFontSelector
  },
  custom: {
    icon: 'tabler:upload',
    Component: CustomFontSelector
  }
} as const

export function useTabbedView() {
  const { fontFamily } = usePersonalization()

  return createTabbedView({
    namespace: 'common.personalization',
    tabs: Object.entries(FONT_PICKER_TABS).map(([id, { icon }]) => ({
      id,
      icon,
      name: `common.personalization:fontFamily.tabs.${id}Fonts`
    })),
    defaultValue: fontFamily.startsWith('custom:') ? 'custom' : 'google'
  })
}
