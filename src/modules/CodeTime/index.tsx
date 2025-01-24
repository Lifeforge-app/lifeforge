import React from 'react'

import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import CodeTimeActivityCalendar from './components/CodeTimeActivityCalendar'
import CodeTimeStatistics from './components/CodeTimeStatistics'
import CodeTimeTopEntries from './components/CodeTimeTopEntries'

export default function CodeTime(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:code" title="Code Time" />
      <div className="mt-6 min-h-0 w-full space-y-12">
        <CodeTimeStatistics />
        <CodeTimeActivityCalendar />
        {['projects', 'languages'].map(type => (
          <CodeTimeTopEntries
            key={type}
            type={type as 'projects' | 'languages'}
          />
        ))}
      </div>
    </ModuleWrapper>
  )
}
