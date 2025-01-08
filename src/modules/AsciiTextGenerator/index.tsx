import React from 'react'
          import ModuleHeader from '@components/Module/ModuleHeader'
          import ModuleWrapper from '@components/Module/ModuleWrapper'
        
          function AsciiTextGenerator(): React.ReactElement {
            return (
              <ModuleWrapper>
                <ModuleHeader title="ASCII Text Generator" icon="tabler:terminal"  />
              </ModuleWrapper>
            )
          }
        
          export default AsciiTextGenerator
          