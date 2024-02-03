import React from 'react'
import ModuleHeader from '../../components/general/ModuleHeader'

function Settings(): React.ReactElement {
  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col px-12">
      <ModuleHeader title="Settings" desc="Configure your application here." />
    </section>
  )
}

export default Settings
