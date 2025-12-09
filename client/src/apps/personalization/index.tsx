import { ModuleHeader } from 'lifeforge-ui'

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
      <div className="mb-8 space-y-3">
        <LanguageSelector />
        <ThemeSelector />
        <ThemeColorSelector />
        <BgTempSelector />
        <BgImageSelector />
        <FontFamilySelector />
        <FontScaleSelector />
        <BorderRadiusSelector />
        <BorderedSelector />
      </div>
    </>
  )
}

export default Personalization
