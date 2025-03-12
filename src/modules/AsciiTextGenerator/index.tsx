import React from 'react'

import { ModuleWrapper , ModuleHeader } from '@lifeforge/ui'

function AsciiTextGenerator(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:terminal" title="ASCII Text Generator" />
    </ModuleWrapper>
  )
}

export default AsciiTextGenerator
