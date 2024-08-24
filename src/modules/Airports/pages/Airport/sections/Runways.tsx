import React from 'react'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'

function Runways({ code }: { code: string }): React.ReactElement {
  const [runways] = useFetch<
    Array<{
      name: string
      info: string
    }>
  >(`airports/airport/${code}/runways`)

  return (
    <div className="mb-12 mt-8 space-y-8">
      <APIComponentWithFallback data={runways}>
        {runways =>
          runways.length > 0 ? (
            <>
              {runways.map(({ name, info }) => (
                <div key={name} className="runway-tables">
                  <h3 className="mb-6 text-2xl font-semibold">{name}</h3>
                  <div dangerouslySetInnerHTML={{ __html: info }} />
                </div>
              ))}
            </>
          ) : (
            <EmptyStateScreen
              icon="tabler:road-off"
              title="No runways found"
              description="There are no runways found for this airport."
            />
          )
        }
      </APIComponentWithFallback>
    </div>
  )
}

export default Runways
