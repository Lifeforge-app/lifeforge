import React from 'react'
import { type IChangeLogVersion } from '../..'
import LogItemHeader from './components/LogItemHeader'
import LogItemContent from './components/LogItemContent'

function LogItem({ entry }: { entry: IChangeLogVersion }): React.ReactElement {
  return (
    <li
      key={entry.version}
      className="space-y-2 rounded-lg bg-bg-50 p-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900"
    >
      <LogItemHeader entry={entry} />
      <LogItemContent entry={entry} />
    </li>
  )
}

export default LogItem
