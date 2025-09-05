import { ContextMenuItem, ModuleHeader, ModuleWrapper } from 'lifeforge-ui'

import CodeTimeActivityCalendar from './components/CodeTimeActivityCalendar'
import CodeTimeStatistics from './components/CodeTimeStatistics'
import CodeTimeTimeChart from './components/CodeTimeTimeChart'
import CodeTimeTopEntries from './components/CodeTimeTopEntries'

export default function CodeTime() {
  return (
    <ModuleWrapper>
      <ModuleHeader
        contextMenuProps={{
          children: (
            <>
              <ContextMenuItem
                icon="tabler:clock"
                label="Manage Schedule"
                onClick={() => {}}
              />
            </>
          )
        }}
        icon="tabler:code"
        title="Code Time"
      />
      <div className="mt-6 mb-12 min-h-0 w-full space-y-3">
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
