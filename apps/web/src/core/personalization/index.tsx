import { ModuleHeader, Stack } from '@lifeforge/ui'

import BgImageSelector from './components/BgImageSelector'
import BgTempSelector from './components/BgTempSelector'
import BorderRadiusSelector from './components/BorderRadiusSelector'
import BorderedSelector from './components/BorderedSelector'
import FontFamilySelector from './components/FontFamilySelector'
import FontScaleSelector from './components/FontScaleSelector'
import LanguageSelector from './components/LanguageSelector'
import ThemeColorSelector from './components/ThemeColorSelector'
import ThemeSelector from './components/ThemeSelector'

function Personalization() {
  return (
    <>
      <ModuleHeader />
      <Stack mb="xl">
        <LanguageSelector />
        <ThemeSelector />
        <ThemeColorSelector />
        <BgTempSelector />
        <BgImageSelector />
        <FontFamilySelector />
        <FontScaleSelector />
        <BorderRadiusSelector />
        <BorderedSelector />
      </Stack>
    </>
  )
}

export default Personalization
