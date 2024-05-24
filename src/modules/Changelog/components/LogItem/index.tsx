import React from 'react'
import { type IChangeLogVersion } from '@typedec/Changelog'
import LogItemContent from './components/LogItemContent'
import LogItemHeader from './components/LogItemHeader'

function LogItem({ entry }: { entry: IChangeLogVersion }): React.ReactElement {
  return (
    <li key={entry.version} className="space-y-6 p-6">
      <LogItemHeader entry={entry} />
      <LogItemContent entry={entry} />
    </li>
  )
}

export default LogItem
