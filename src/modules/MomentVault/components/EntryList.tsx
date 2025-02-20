import React from 'react'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import { Loadable } from '@interfaces/common'
import { IMomentVaultEntry } from '@interfaces/moment_vault_interfaces'
import AudioEntry from './entries/AudioEntry'

function EntryList({
  data
}: {
  data: Loadable<IMomentVaultEntry[]>
}): React.ReactElement {
  return (
    <APIFallbackComponent data={data}>
      {data => (
        <div className="mt-6 space-y-4 mb-24 md:mb-6">
          {data.map(entry => (
            <AudioEntry key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </APIFallbackComponent>
  )
}

export default EntryList
