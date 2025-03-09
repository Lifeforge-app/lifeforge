import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import React, { useMemo, useState } from 'react'
import { Button } from '@components/buttons'
import {
  ListboxOrComboboxInput,
  ListboxOrComboboxOption
} from '@components/inputs'
import DashboardItem from '@components/utilities/DashboardItem'
import {
  IRailwayMapLine,
  IRailwayMapStation
} from '@interfaces/railway_map_interfaces'

function RoutePlanner({
  isOpen,
  start,
  end,
  lines,
  stations,
  setStart,
  setEnd,
  clearShortestRoute,
  loading,
  hasShortestRoute,
  fetchShortestRoute
}: {
  isOpen: boolean
  start: string
  end: string
  stations: IRailwayMapStation[]
  lines: IRailwayMapLine[]
  setStart: (end: string) => void
  setEnd: (start: string) => void
  clearShortestRoute: () => void
  loading: boolean
  hasShortestRoute: boolean
  fetchShortestRoute: () => Promise<void>
}): React.ReactElement {
  const [startQuery, setStartQuery] = useState('')
  const [endQuery, setEndQuery] = useState('')

  const filteredStart = useMemo(
    () =>
      stations.filter(
        station =>
          station.name.toLowerCase().includes(startQuery.toLowerCase()) ||
          station.codes.some(code =>
            code.toLowerCase().includes(startQuery.toLowerCase())
          )
      ),
    [stations, startQuery]
  )
  const filteredEnd = useMemo(
    () =>
      stations.filter(
        station =>
          station.name.toLowerCase().includes(endQuery.toLowerCase()) ||
          station.codes.some(code =>
            code.toLowerCase().includes(endQuery.toLowerCase())
          )
      ),
    [stations, endQuery]
  )

  return (
    <DashboardItem
      className={clsx(
        'h-min overflow-hidden transition-all px-4 duration-500',
        isOpen ? 'max-h-[calc(100vh-4rem)] py-4 mt-4' : 'max-h-0 py-0 mt-0'
      )}
      componentBesideTitle={
        hasShortestRoute && (
          <Button
            isRed
            icon="tabler:trash"
            variant="no-bg"
            onClick={() => {
              setStart('')
              setEnd('')
              setStartQuery('')
              setEndQuery('')
              clearShortestRoute()
            }}
          />
        )
      }
      icon="tabler:route"
      namespace="modules.railwayMap"
      title="Route Planner"
    >
      <div className="w-full flex items-center gap-4">
        <ListboxOrComboboxInput
          className="w-1/2"
          displayValue={value =>
            (stations.find(station => station.id === value)?.name ?? '') +
            (stations.find(station => station.id === value)
              ? ` (${stations
                  .find(station => station.id === value)!
                  .codes.join(', ')})`
              : '')
          }
          icon="material-symbols:start-rounded"
          name="Boarding at"
          namespace="modules.railwayMap"
          setQuery={setStartQuery}
          setValue={setStart}
          type="combobox"
          value={start}
        >
          {filteredStart.map(station => (
            <ListboxOrComboboxOption
              key={station.id}
              iconAtEnd
              icon={
                <div className="flex items-center gap-2">
                  {station.codes.map(code => (
                    <span
                      key={code}
                      className="text-bg-100 font-['LTAIdentityMedium'] px-2.5 rounded-full text-sm py-0.5"
                      style={{
                        backgroundColor:
                          lines.find(
                            line =>
                              code.startsWith(line.code.slice(0, 2)) ||
                              (code.startsWith('CG') && line.code === 'EWL') ||
                              (code.startsWith('CE') && line.code === 'CCL')
                          )?.color ?? '#333'
                      }}
                    >
                      {code}
                    </span>
                  ))}
                </div>
              }
              text={station.name}
              type="combobox"
              value={station.id}
            />
          ))}
        </ListboxOrComboboxInput>
        <Icon className="text-zinc-500 size-6" icon="tabler:arrows-exchange" />
        <ListboxOrComboboxInput
          className="w-1/2"
          displayValue={value =>
            (stations.find(station => station.id === value)?.name ?? '') +
            (stations.find(station => station.id === value)
              ? ` (${stations
                  .find(station => station.id === value)!
                  .codes.join(', ')})`
              : '')
          }
          icon="tabler:flag"
          name="Alighting at"
          namespace="modules.railwayMap"
          setQuery={setEndQuery}
          setValue={setEnd}
          type="combobox"
          value={end}
        >
          {filteredEnd.map(station => (
            <ListboxOrComboboxOption
              key={station.id}
              iconAtEnd
              icon={
                <div className="flex items-center gap-2">
                  {station.codes.map(code => (
                    <span
                      key={code}
                      className="text-bg-100 font-['LTAIdentityMedium'] px-2.5 rounded-full text-sm py-0.5"
                      style={{
                        backgroundColor:
                          lines.find(
                            line =>
                              code.startsWith(line.code.slice(0, 2)) ||
                              (code.startsWith('CG') && line.code === 'EWL') ||
                              (code.startsWith('CE') && line.code === 'CCL')
                          )?.color ?? '#333'
                      }}
                    >
                      {code}
                    </span>
                  ))}
                </div>
              }
              text={station.name}
              type="combobox"
              value={station.id}
            />
          ))}
        </ListboxOrComboboxInput>
      </div>
      <Button
        iconAtEnd
        className="mt-2"
        disabled={start === '' || end === ''}
        icon="tabler:arrow-right"
        loading={loading}
        onClick={() => {
          fetchShortestRoute().catch(console.error)
        }}
      >
        Show Route
      </Button>
    </DashboardItem>
  )
}

export default RoutePlanner
