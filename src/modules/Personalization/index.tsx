import React from 'react'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import BgImageSelector from './components/BgImageSelector'
import BgTempSelector from './components/BgTempSelector'
import FontFamilySelector from './components/FontFamilySelector'
import LanguageSelector from './components/LanguageSelector'
import ThemeColorSelector from './components/ThemeColorSelector'
import ThemeSelector from './components/ThemeSelector'

function Personalization(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:palette" title="Personalization" />
      <div className="my-8">
        <LanguageSelector />
        <ThemeSelector />
        <ThemeColorSelector />
        <BgTempSelector />
        <BgImageSelector />
        <FontFamilySelector />
      </div>
    </ModuleWrapper>
  )
}

export default Personalization
