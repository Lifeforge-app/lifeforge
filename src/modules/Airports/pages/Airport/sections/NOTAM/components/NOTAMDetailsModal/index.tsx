/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import ModalWrapper from '@components/Modals/ModalWrapper'
import ModalHeader from '@components/Modals/ModalHeader'
import APIFallbackComponent from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import Scrollbar from '@components/Miscellaneous/Scrollbar'
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
    <ModalWrapper isOpen={isOpen} className="h-full md:!min-w-[40vw]">
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
                  raw={NOTAMData.raw}
                  id={selectedNOTAMData.id}
                  isOpen={isOpen}
                />
                {NOTAMData.qualification?.coordinates !== undefined && (
                  <RegionMap data={NOTAMData} />
                )}
              </div>
            </Scrollbar>
          ) : (
            <EmptyStateScreen
              title="No data found"
              description="The NOTAM data could not be found"
              icon="tabler:file-text"
            />
          )
        }
      </APIFallbackComponent>
    </ModalWrapper>
  )
}

export default NOTAMDetailsModal
