import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

addons.setConfig({
  panelPosition: 'bottom',
  theme: create({
    base: 'dark',
    brandUrl: 'https://docs.lifeforge.dev',
    appBg: '#171717',
    appBorderColor: '#262626',
    appBorderRadius: 8,
    brandTitle:
      '<img src="https://raw.githubusercontent.com/LifeForge-app/lifeforge/refs/heads/main/client/public/icon.svg" style="margin-right:0.25rem" width="22px"/> <span style="font-size:18px; font-weight: 700">LifeForge<span style="color:#9cc05e; padding-right:0.3rem">.</span></span> UI',
    brandTarget: '_self',
    textColor: '#f5f5f5',
    fontBase: '"Onest", sans-serif',
    fontCode: '"JetBrains Mono", monospace',
    buttonBg: '#9cc05e',
    colorPrimary: '#9cc05e',
    appContentBg: '#171717',
    barTextColor: '#f5f5f5',
    barBg: '#1f1f1f',
    inputBg: '#262626',
    inputBorder: '#333333',
    inputTextColor: '#f5f5f5',
    inputBorderRadius: 4,
    colorSecondary: '#9cc05e',
    textMutedColor: '#999999',
    textInverseColor: '#1f1f1f',
    barHoverColor: '#9cc05e',
    appHoverBg: '#1f1f1f',
    appPreviewBg: '#1f1f1f',
    barSelectedColor: '#9cc05e',
    booleanBg: '#262626',
    booleanSelectedBg: '#7aa637',
    buttonBorder: 'none'
  })
})
