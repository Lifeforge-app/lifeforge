import React from 'react'

import ModuleHeader from '../../components/general/ModuleHeader'
import CodeTimeStatistics from './components/CodeTimeStatistics'
import CodeTimeActivityCalendar from './components/CodeTimeActivityCalendar'
import CodeTimeMostProjects from './components/CodeTimeMostProjects'
import CodeTimeMostLanguages from './components/CodeTimeMostLanguages'

export default function CodeTime(): React.JSX.Element {
  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col overflow-y-auto px-8 sm:px-12">
      <ModuleHeader
        title="Code Time"
        desc="See how much time you spend grinding code."
      />
      <div className="mt-8 flex min-h-0 w-full flex-1 flex-col items-center">
        <CodeTimeStatistics />
        <CodeTimeActivityCalendar />
        <CodeTimeMostProjects />
        <CodeTimeMostLanguages />
      </div>
    </section>
  )
}
