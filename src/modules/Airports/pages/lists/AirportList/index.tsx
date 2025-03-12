import { useDebounce } from '@uidotdev/usehooks'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import {
  APIFallbackComponent,
  EmptyStateScreen,
  ModuleHeader,
  ModuleWrapper,
  Scrollbar,
  SearchInput
} from '@lifeforge/ui'

import useFetch from '@hooks/useFetch'

import ContinentSelector from '../../../components/ContinentSelector'
import MasterSearchBar from '../../../components/MasterSearchBar'
import Breadcrumbs from '../Breadcrumb'
import EntryItem from './components/EntryItem'

const AIRPORT_TYPES = {
  large_airport: ['text-yellow-500', 'uil:plane'],
  medium_airport: ['text-sky-500', 'uil:plane'],
  small_airport: ['text-pink-500', 'uil:plane'],
  heliport: ['text-blue-500', 'tabler:helicopter-landing'],
  seaplane_base: ['text-orange-500', 'tabler:anchor'],
  balloonport: ['text-green-500', 'tabler:air-balloon'],
  closed: ['text-red-500', 'tabler:ban']
}

function AirportsList() {
  const { regionID } = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 500)
  const [airportsData] = useFetch<{
    data: Array<{
      id: string
      location: string
      type: string
      name: string
    }>
    breadcrumbs: string[]
  }>(`airports/airport/list/${regionID}`)
  const [filteredData, setFilteredData] = useState<
    | Array<{
        id: string
        location: string
        type: string
        name: string
      }>
    | 'loading'
    | 'error'
  >('loading')

  useEffect(() => {
    if (typeof airportsData !== 'string') {
      setFilteredData(
        airportsData.data.filter(({ name }) =>
          name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        )
      )
    } else {
      setFilteredData(airportsData)
    }
  }, [debouncedSearchQuery, airportsData])

  return (
    <ModuleWrapper>
      <ModuleHeader title="Airports" />
      <MasterSearchBar />
      <APIFallbackComponent data={airportsData} showLoading={false}>
        {continentsData => (
          <Breadcrumbs breadcrumbs={continentsData.breadcrumbs} />
        )}
      </APIFallbackComponent>
      <div className="mt-4 flex items-center gap-2">
        <ContinentSelector />
        <SearchInput
          hasTopMargin={false}
          namespace="modules.airports"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="airport"
        />
      </div>
      <APIFallbackComponent data={filteredData}>
        {data => (
          <Scrollbar className="mt-6">
            <div className="mb-8 flex-1 space-y-4 px-4">
              {data.length > 0 ? (
                data
                  .sort((a, b) => {
                    const order = Object.keys(AIRPORT_TYPES)
                    const firstComparison =
                      order.indexOf(a.type) - order.indexOf(b.type)

                    return (
                      firstComparison ||
                      a.name.localeCompare(b.name, undefined, {
                        sensitivity: 'base'
                      })
                    )
                  })
                  .map(({ name, location, type, id }) => (
                    <EntryItem
                      key={id}
                      id={id}
                      location={location}
                      name={name}
                      type={type}
                    />
                  ))
              ) : (
                <EmptyStateScreen
                  icon="tabler:plane-off"
                  name="airports"
                  namespace="modules.airports"
                />
              )}
            </div>
          </Scrollbar>
        )}
      </APIFallbackComponent>
    </ModuleWrapper>
  )
}

export default AirportsList
