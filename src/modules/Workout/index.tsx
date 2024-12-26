import React from 'react'
          import ModuleHeader from '@components/Module/ModuleHeader'
          import ModuleWrapper from '@components/Module/ModuleWrapper'
        
          function Workout(): React.ReactElement {
            return (
              <ModuleWrapper>
                <ModuleHeader title="Workout" icon="tabler:barbell"  />
              </ModuleWrapper>
            )
          }
        
          export default Workout
          