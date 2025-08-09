import { ModuleHeader, ModuleWrapper } from 'lifeforge-ui'

import CodeTimeActivityCalendar from './components/CodeTimeActivityCalendar'
import CodeTimeStatistics from './components/CodeTimeStatistics'
import CodeTimeTimeChart from './components/CodeTimeTimeChart'
import CodeTimeTopEntries from './components/CodeTimeTopEntries'

export default function CodeTime() {
  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:code" title="Code Time" />
      <div className="my-6 min-h-0 w-full space-y-4">
        <CodeTimeStatistics />
        <CodeTimeActivityCalendar />
        {['projects', 'languages'].map(type => (
          <>
            <CodeTimeTimeChart
              key={`${type}-time-chart`}
              type={type as 'projects' | 'languages'}
            />
            <CodeTimeTopEntries
              key={`${type}-top-entries`}
              type={type as 'projects' | 'languages'}
            />
          </>
        ))}
      </div>
    </ModuleWrapper>
  )
}
