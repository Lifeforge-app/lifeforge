import { Fragment } from 'react'

import { ContextMenu, ContextMenuItem, Grid, ModuleHeader } from '@lifeforge/ui'

import CoddeTimeDailyHourTrendChart from './components/CoddeTimeDailyHourTrendChart'
import CodeTimeActivityCalendar from './components/CodeTimeActivityCalendar'
import CodeTimeStatistics from './components/CodeTimeStatistics'
import CodeTimeTimeChart from './components/CodeTimeTimeChart'
import CodeTimeTopEntries from './components/CodeTimeTopEntries'

export default function CodeTime() {
  return (
    <>
      <ModuleHeader
        trailing={
          <ContextMenu>
            <ContextMenuItem
              icon="tabler:clock"
              label="Manage Schedule"
              onClick={() => {}}
            />
          </ContextMenu>
        }
      />
      <Grid gap="sm" mb="xl" templateCols={{ base: 1, lg: 2 }} width="100%">
        <CodeTimeStatistics />
        <CodeTimeActivityCalendar />
        {['projects', 'languages'].map(type => (
          <Fragment key={type}>
            <CodeTimeTimeChart type={type as 'projects' | 'languages'} />
            <CodeTimeTopEntries type={type as 'projects' | 'languages'} />
          </Fragment>
        ))}
        <CoddeTimeDailyHourTrendChart />
      </Grid>
    </>
  )
}
