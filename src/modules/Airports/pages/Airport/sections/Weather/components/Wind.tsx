import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import React from 'react'
import WidgetWrapper from './WidgetWrapper'
import { IAirportMETARData } from '..'

function Wind({ data }: { data: IAirportMETARData }): React.ReactElement {
  return (
    <WidgetWrapper>
      <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold text-bg-500">
        <Icon className="text-2xl" icon="tabler:wind" />
        <span className="ml-2">Wind</span>
      </h1>
      {data.wind !== undefined ? (
        <div
          className={clsx(
            'flex flex-1 flex-col items-center justify-center gap-2 rounded-md p-4',
            data.wind.gust_kts > 30 && 'bg-red-500/20 text-red-500',
            data.wind.gust_kts > 20 && 'bg-yellow-500/20 text-yellow-500',
            data.wind.gust_kts <= 20 && 'bg-green-500/20 text-green-500'
          )}
        >
          <p className="text-center text-3xl font-medium">
            {data.wind.speed_kts.toFixed(2)} kts{' '}
            <span className="text-lg">
              ({data.wind.speed_mps.toFixed(2)} m/s)
            </span>
          </p>
          <p className="text-center">
            {data.wind.degrees}° ({data.wind.gust_kts.toFixed(2)} kts)
          </p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-md bg-bg-500/20 p-4 text-bg-500">
          <p className="text-center text-3xl font-medium">Calm</p>
        </div>
      )}
    </WidgetWrapper>
  )
}

export default Wind
