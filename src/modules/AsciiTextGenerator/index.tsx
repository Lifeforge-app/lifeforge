import React from 'react'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'

function AsciiTextGenerator(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader title="ASCII Text Generator" icon="tabler:terminal" />
    </ModuleWrapper>
  )
}

export default AsciiTextGenerator
