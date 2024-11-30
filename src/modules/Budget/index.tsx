import React from 'react'
          import ModuleHeader from '@components/Module/ModuleHeader'
          import ModuleWrapper from '@components/Module/ModuleWrapper'
        
          function Budget(): React.ReactElement {
            return (
              <ModuleWrapper>
                <ModuleHeader title="Budget" icon="tabler:calculator"  />
              </ModuleWrapper>
            )
          }
        
          export default Budget
          