import { ModuleHeader, ModuleWrapper } from '@lifeforge/ui'

import CodeTimeActivityCalendar from './components/CodeTimeActivityCalendar'
import CodeTimeStatistics from './components/CodeTimeStatistics'
import CodeTimeTimeChart from './components/CodeTimeTimeChart'
import CodeTimeTopEntries from './components/CodeTimeTopEntries'

export default function CodeTime() {
  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:code" title="Code Time" />
      <div className="mt-12 min-h-0 w-full space-y-12">
        <CodeTimeStatistics />
        <CodeTimeActivityCalendar />
        {['projects', 'languages'].map(type => (
          <>
            <CodeTimeTimeChart
              key={type}
              type={type as 'projects' | 'languages'}
            />
            <CodeTimeTopEntries
              key={type}
              type={type as 'projects' | 'languages'}
            />
          </>
        ))}
      </div>
    </ModuleWrapper>
  )
}
