import React from 'react'
import ModuleHeader from '@components/ModuleHeader'
import ThemeSelector from './components/ThemeSelector'
import ThemeColorSelector from './components/ThemeColorSelector'
import BgTempSelector from './components/BgTempSelector'
import ModuleWrapper from '@components/ModuleWrapper'

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
