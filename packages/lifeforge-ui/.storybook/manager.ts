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
      '<img src="https://raw.githubusercontent.com/Lifeforge-app/lifeforge/refs/heads/main/client/public/icon.svg" style="margin-right:0.25rem" width="24px"/> <span style="font-size:18px">LifeForge<span> style="color:#9cc05e">.</span></span> UI',
    brandTarget: '_self',
    textColor: '#f5f5f5'
  })
})
