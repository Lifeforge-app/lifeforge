import React from 'react'

import ModuleHeader from '../../components/general/ModuleHeader'
import CodeTimeStatistics from './components/CodeTimeStatistics'
import CodeTimeActivityCalendar from './components/CodeTimeActivityCalendar'
import CodeTimeMostProjects from './components/CodeTimeMostProjects'
import CodeTimeMostLanguages from './components/CodeTimeMostLanguages'
import ModuleWrapper from '../../components/general/ModuleWrapper'

export default function CodeTime(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Code Time"
        desc="See how much time you spend grinding code."
      />
      <div className="mt-6 flex min-h-0 w-full flex-1 flex-col items-center">
        <CodeTimeStatistics />
        <CodeTimeActivityCalendar />
        <CodeTimeMostProjects />
        <CodeTimeMostLanguages />
      </div>
    </ModuleWrapper>
  )
}
