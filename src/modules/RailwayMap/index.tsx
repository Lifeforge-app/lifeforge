import { Listbox, ListboxButton } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import HamburgerSelectorWrapper from '@components/buttons/HamburgerMenu/components/HamburgerSelectorWrapper'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import {
  ListboxOrComboboxOption,
  ListboxOrComboboxOptions,
  SearchInput
} from '@components/inputs'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import QueryWrapper from '@components/screens/QueryWrapper'
import useAPIQuery from '@hooks/useAPIQuery'
import useThemeColors from '@hooks/useThemeColor'
import {
  IRailwayMapLine,
  IRailwayMapStation
} from '@interfaces/railway_map_interfaces'
import fetchAPI from '@utils/fetchAPI'
import { toCamelCase } from '@utils/strings'
import MapInstance from './components/MapInstance'
import RouteMap from './components/RouteMap'
import RoutePlanner from './components/RoutePlanner'

const VIEW_TYPES = [
  ['tabler:route-alt-left', 'Route Map', 'route'],
  ['tabler:world', 'Earth Map', 'earth'],
  ['tabler:list', 'Station List', 'list']
]

function RailwayMap(): React.ReactElement {
  const { componentBgWithHover } = useThemeColors()
  const { t } = useTranslation('modules.railwayMap')
  const [viewType, setViewType] = useState<'route' | 'earth' | 'list'>('route')
  const [searchQuery, setSearchQuery] = useState('')
  const linesQuery = useAPIQuery<IRailwayMapLine[]>('railway-map/lines', [
    'railway-map',
    'lines'
  ])
  const stationsQuery = useAPIQuery<IRailwayMapStation[]>(
    'railway-map/stations',
    ['railway-map', 'stations']
  )
  const [filteredLines, setFilteredLines] = useState<string[]>([])
  const [routePlannerOpen, setRoutePlannerOpen] = useState(false)
  const [routePlannerStart, setRoutePlannerStart] = useState('')
  const [routePlannerEnd, setRoutePlannerEnd] = useState('')
  const [routePlannerLoading, setRoutePlannerLoading] = useState(false)
  const [shortestRoute, setShortestRoute] = useState<IRailwayMapStation[]>([])

  async function fetchShortestRoute() {
    if (!routePlannerStart || !routePlannerEnd) {
      toast.error('Please select a start and end station')
      return
    }

    setRoutePlannerLoading(true)
    setShortestRoute([])
    try {
      const data = await fetchAPI<IRailwayMapStation[]>(
        `railway-map/shortest?start=${routePlannerStart}&end=${routePlannerEnd}`
      )
      setShortestRoute(data)
    } catch {
      toast.error('Failed to fetch shortest route')
    } finally {
      setRoutePlannerLoading(false)
    }
  }

  useEffect(() => {
    if (linesQuery.data) {
      setFilteredLines(linesQuery.data.map(line => line.id))
    }
  }, [linesQuery.data])

  return (
    <ModuleWrapper>
      <ModuleHeader icon="uil:subway" title="Railway Map" />
      <QueryWrapper query={linesQuery}>
        {lines => (
          <QueryWrapper query={stationsQuery}>
            {stations => (
              <>
                <div className="mt-6 flex items-center gap-2">
                  <Listbox
                    as="div"
                    className="relative hidden md:block"
                    value={viewType}
                    onChange={value => {
                      setViewType(value)
                    }}
                  >
                    <ListboxButton
                      className={clsx(
                        'flex-between gap-12 flex gap-2 rounded-md p-4 shadow-custom',
                        componentBgWithHover
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon
                          className="size-6"
                          icon={
                            VIEW_TYPES.find(
                              ([, , value]) => value === viewType
                            )?.[0] ?? ''
                          }
                        />
                        <span className="whitespace-nowrap font-medium">
                          {t(
                            `viewTypes.${toCamelCase(
                              VIEW_TYPES.find(
                                ([, , value]) => value === viewType
                              )?.[1] ?? ''
                            )}`
                          )}
                        </span>
                      </div>
                      <Icon
                        className="size-5 shrink-0 text-bg-500"
                        icon="tabler:chevron-down"
                      />
                    </ListboxButton>
                    <ListboxOrComboboxOptions>
                      {VIEW_TYPES.map(([icon, name, value]) => (
                        <ListboxOrComboboxOption
                          key={value}
                          icon={icon}
                          text={t(`viewTypes.${toCamelCase(name)}`)}
                          value={value}
                        />
                      ))}
                    </ListboxOrComboboxOptions>
                  </Listbox>
                  <SearchInput
                    hasTopMargin={false}
                    namespace="modules.railwayMap"
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    stuffToSearch="station"
                  />
                  <HamburgerMenu
                    largerIcon
                    largerPadding
                    customIcon="tabler:filter"
                  >
                    <HamburgerSelectorWrapper
                      icon="lucide:rail-symbol"
                      title="Railway Lines"
                    >
                      {lines.map(line => (
                        <MenuItem
                          key={line.id}
                          preventDefault
                          icon={
                            <span
                              className="text-bg-100 font-['LTAIdentityMedium'] px-2.5 rounded-full text-sm py-0.5"
                              style={{
                                backgroundColor: line.color
                              }}
                            >
                              {line.code}
                            </span>
                          }
                          isToggled={filteredLines.includes(line.id)}
                          namespace={false}
                          text={line.name}
                          onClick={() => {
                            setFilteredLines(prev =>
                              prev.includes(line.id)
                                ? prev.filter(l => l !== line.id)
                                : [...prev, line.id]
                            )
                          }}
                        />
                      ))}
                    </HamburgerSelectorWrapper>
                  </HamburgerMenu>
                  <Button
                    icon="tabler:route"
                    variant={routePlannerOpen ? 'primary' : 'no-bg'}
                    onClick={() => {
                      setRoutePlannerOpen(!routePlannerOpen)
                    }}
                  />
                </div>
                <RoutePlanner
                  clearShortestRoute={() => setShortestRoute([])}
                  end={routePlannerEnd}
                  fetchShortestRoute={fetchShortestRoute}
                  hasShortestRoute={shortestRoute.length > 0}
                  isOpen={routePlannerOpen}
                  lines={lines.filter(line => line.type === 'MRT')}
                  loading={routePlannerLoading}
                  setEnd={setRoutePlannerEnd}
                  setStart={setRoutePlannerStart}
                  start={routePlannerStart}
                  stations={stations.filter(
                    station => station.map_data !== null
                  )}
                />
                {(() => {
                  switch (viewType) {
                    case 'earth':
                      return (
                        <div className="flex-1 py-8 overflow-hidden">
                          <div className="w-full h-full rounded-lg shadow-custom overflow-hidden">
                            <MapInstance
                              filteredLinesCode={filteredLines}
                              lines={lines}
                              stations={stations}
                            />
                          </div>
                        </div>
                      )

                    case 'route':
                      return (
                        <RouteMap
                          filteredLinesCode={filteredLines}
                          lines={lines}
                          shortestRoute={shortestRoute}
                          stations={stations}
                        />
                      )
                  }
                })()}
              </>
            )}
          </QueryWrapper>
        )}
      </QueryWrapper>
    </ModuleWrapper>
  )
}

export default memo(RailwayMap)
