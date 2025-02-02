import React from 'react'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import Scrollbar from '@components/utilities/Scrollbar'
import useFetch from '@hooks/useFetch'
import { type IAirportNOTAMEntry } from '@interfaces/airports_interfaces'
import Header from './components/Header'
import PropsTable from './components/PropsTable'
import RawCodeAndSummary from './components/RawCodeAndSummary'
import RegionMap from './components/RegionMap'

function NOTAMDetailsModal({
  isOpen,
  selectedNOTAMData,
  onClose
}: {
  isOpen: boolean
  selectedNOTAMData: IAirportNOTAMEntry | null
  onClose: () => void
}): React.ReactElement {
  const [NOTAMData] = useFetch<any>(
    `airports/NOTAM/${selectedNOTAMData?.id}`,
    isOpen && selectedNOTAMData !== null
  )

  return (
    <ModalWrapper className="h-full md:min-w-[40vw]!" isOpen={isOpen}>
      <ModalHeader
        icon="uil:exclamation-octagon"
        title="NOTAM Details"
        onClose={onClose}
      />
      <APIFallbackComponent data={NOTAMData}>
        {NOTAMData =>
          selectedNOTAMData !== null && NOTAMData !== 'none' ? (
            <Scrollbar>
              <div>
                <Header
                  data={NOTAMData}
                  selectedNOTAMData={selectedNOTAMData}
                />
                {NOTAMData.qualification !== undefined && (
                  <PropsTable data={NOTAMData} />
                )}
                <RawCodeAndSummary
                  id={selectedNOTAMData.id}
                  isOpen={isOpen}
                  raw={NOTAMData.raw}
                />
                {NOTAMData.qualification?.coordinates !== undefined && (
                  <RegionMap data={NOTAMData} />
                )}
              </div>
            </Scrollbar>
          ) : (
            <EmptyStateScreen
              icon="tabler:file-text"
              name="NOTAM"
              namespace="modules.airports"
            />
          )
        }
      </APIFallbackComponent>
    </ModalWrapper>
  )
}

export default NOTAMDetailsModal
