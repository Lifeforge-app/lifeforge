import {
  Controls,
  Description,
  Primary,
  Stories,
  Subtitle,
  Title
} from '@storybook/addon-docs/blocks'
import type { Preview } from '@storybook/react-vite'
import { themes } from 'storybook/theming'

import PreviewWrapper from '@/storybook/PreviewWrapper'
import BG_TEMP_TOOLBAR_CONFIG from '@/storybook/toolbars/bgTemp'
import FONT_SCALE_TOOLBAR_CONFIG from '@/storybook/toolbars/fontScale'
import THEME_TOOLBAR_CONFIG from '@/storybook/toolbars/theme'
import THEME_COLOR_TOOLBAR_CONFIG from '@/storybook/toolbars/themeColor'

import './i18n'
import './index.css'

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
  decorators: [PreviewWrapper],
  globalTypes: {
    theme: THEME_TOOLBAR_CONFIG,
    themeColor: THEME_COLOR_TOOLBAR_CONFIG,
    fontScale: FONT_SCALE_TOOLBAR_CONFIG,
    bgTemp: BG_TEMP_TOOLBAR_CONFIG
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
