import React from 'react'
import ModuleHeader from '../../components/general/ModuleHeader'
import ThemeSelector from './components/ThemeSelector'
import ThemeColorSelector from './components/ThemeColorSelector'

function Personalization(): React.ReactElement {
  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col overflow-y-scroll px-8 sm:px-12">
      <ModuleHeader
        title="Personalisation"
        desc="Customise your experience with the app."
      />
      <ThemeSelector />
      <div className="my-6 w-full border-b-[1.5px] border-neutral-200 dark:border-neutral-700" />
      <ThemeColorSelector />
    </section>
  )
}

export default Personalization
