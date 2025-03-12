import { APIFallbackComponent, EmptyStateScreen } from '@lifeforge/ui'

import useFetch from '@hooks/useFetch'

function Runways({ code }: { code: string }) {
  const [runways] = useFetch<
    Array<{
      name: string
      info: string
    }>
  >(`airports/airport/${code}/runways`)

  return (
    <div className="my-8 space-y-8">
      <APIFallbackComponent data={runways}>
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
              name="runway"
              namespace="modules.airports"
            />
          )
        }
      </APIFallbackComponent>
    </div>
  )
}

export default Runways
