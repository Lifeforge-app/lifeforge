/* eslint-disable @typescript-eslint/no-throw-literal */
/* eslint-disable @typescript-eslint/indent */
import React from 'react'
import ModuleHeader from '../../components/general/ModuleHeader'
import useFetch from '../../hooks/useFetch'
import LogItem from './components/LogItem'
import APIComponentWithFallback from '../../components/general/APIComponentWithFallback'
import ModuleWrapper from '../../components/general/ModuleWrapper'

export interface IChangeLogVersion {
  version: string
  date_range: [string, string]
  entries: IChangeLogEntry[]
}

interface IChangeLogEntry {
  id: string
  feature: string
  description: string
}

function Changelog(): React.ReactElement {
  const [data] = useFetch<IChangeLogVersion[]>('change-log/list')

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Change Log"
        desc="All the changes made to this application will be listed here."
      />
      <APIComponentWithFallback data={data}>
        <ul className="my-8 flex flex-col gap-4">
          {typeof data !== 'string' &&
            data.map(entry => <LogItem key={entry.version} entry={entry} />)}
        </ul>
      </APIComponentWithFallback>
    </ModuleWrapper>
  )
}

export default Changelog
