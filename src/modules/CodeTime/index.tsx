import React from 'react'

import ModuleHeader from '@components/ModuleHeader'
import CodeTimeStatistics from './components/CodeTimeStatistics'
import CodeTimeActivityCalendar from './components/CodeTimeActivityCalendar'
import CodeTimeTopEntries from './components/CodeTimeTopEntries'
import ModuleWrapper from '@components/ModuleWrapper'

export default function CodeTime(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Code Time"
        desc="See how much time you spend grinding code."
      />
      <div className="mt-8 min-h-0 w-full space-y-12">
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
