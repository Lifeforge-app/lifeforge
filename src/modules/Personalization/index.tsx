import React from 'react'
import ModuleHeader from '@components/ModuleHeader'
import ModuleWrapper from '@components/ModuleWrapper'
import BgTempSelector from './components/BgTempSelector'
import ThemeColorSelector from './components/ThemeColorSelector'
import ThemeSelector from './components/ThemeSelector'

function Personalization(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Personalisation"
        desc="Customise your experience with the app."
      />
      <ThemeSelector />
      <div className="my-6 w-full border-b-[1.5px] border-bg-200 dark:border-bg-800" />
      <ThemeColorSelector />
      <div className="my-6 w-full border-b-[1.5px] border-bg-200 dark:border-bg-800" />
      <BgTempSelector />
    </ModuleWrapper>
  )
}

export default Personalization
