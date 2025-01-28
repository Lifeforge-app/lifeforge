import React from 'react'
import { type IChangeLogVersion } from '@interfaces/changelog_interfaces'
import LogItemContent from './components/LogItemContent'
import LogItemHeader from './components/LogItemHeader'

function LogItem({ entry }: { entry: IChangeLogVersion }): React.ReactElement {
  return (
    <li
      key={entry.version}
      className="space-y-6 rounded-lg bg-bg-50 p-6 shadow-custom dark:bg-bg-900 sm:bg-transparent! sm:shadow-none sm:dark:bg-transparent!"
    >
      <LogItemHeader entry={entry} />
      <LogItemContent entry={entry} />
    </li>
  )
}

export default LogItem
