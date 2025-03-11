import React from 'react'

import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'

function AsciiTextGenerator(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:terminal" title="ASCII Text Generator" />
    </ModuleWrapper>
  )
}

export default AsciiTextGenerator
