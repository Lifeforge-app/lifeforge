import { useDebounce } from '@uidotdev/usehooks'
import { Button, SearchInput, useModalStore } from 'lifeforge-ui'
import { useState } from 'react'

import { useUnitData } from '../../providers/UnitDataProvider'
import UnitDataImportModal from './UnitDataImportModal'
import UnitDataListItem from './UnitDataListItem'

function UnitDataMode() {
  const open = useModalStore(state => state.open)

  const { unitData, setUnitData } = useUnitData()

  const [searchQuery, setSearchQuery] = useState('')

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

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
        searchTarget="store"
        onChange={setSearchQuery}
        value={searchQuery}
      />
      {unitData.length > 0 ? (
        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
          {unitData
            .filter(entry => {
              if (!debouncedSearchQuery.startsWith('@')) {
                return entry.name
                  .toLowerCase()
                  .includes(debouncedSearchQuery.toLowerCase())
              } else {
                const unitSearch = debouncedSearchQuery
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
