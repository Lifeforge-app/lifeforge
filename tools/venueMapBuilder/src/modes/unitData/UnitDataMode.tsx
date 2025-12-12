import { Button, SearchInput, useModalStore } from 'lifeforge-ui'
import { useState } from 'react'

import { useUnitData } from '../../providers/UnitDataProvider'
import UnitDataImportModal from './UnitDataImportModal'
import UnitDataListItem from './UnitDataListItem'

function UnitDataMode() {
  const open = useModalStore(state => state.open)

  const { unitData, setUnitData } = useUnitData()

  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col space-y-4">
      <div className="flex items-center gap-2">
        <Button
          className="flex-1"
          icon="tabler:braces"
          variant="secondary"
          onClick={() => {
            open(UnitDataImportModal, {
              setUnitData
            })
          }}
        >
          Import Data
        </Button>
      </div>
      <SearchInput
        className="component-bg-lighter-with-hover"
        debounceMs={300}
        searchTarget="store"
        value={searchQuery}
        onChange={setSearchQuery}
      />
      {unitData.length > 0 ? (
        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
          {unitData
            .filter(entry => {
              if (!searchQuery.startsWith('@')) {
                return entry.name
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              } else {
                const unitSearch = searchQuery
                  .slice(1)
                  .replace(/\s/g, '')
                  .toLowerCase()

                return entry.unit
                  .replace(/\s/g, '')
                  .toLowerCase()
                  .includes(unitSearch)
              }
            })
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((entry, index) => (
              <UnitDataListItem key={index} entry={entry} />
            ))}
        </div>
      ) : (
        <div className="text-bg-500 text-center text-sm">
          No unit data imported yet
        </div>
      )}
    </div>
  )
}

export default UnitDataMode
