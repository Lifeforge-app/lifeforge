import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import WidgetWrapper from './WidgetWrapper'
import { IAirportMETARData } from '..'

function FlightCategory({
  data
}: {
  data: IAirportMETARData
}): React.ReactElement {
  return (
    <WidgetWrapper>
      <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold text-bg-500">
        <Icon className="text-2xl" icon="tabler:plane" />
        <span className="ml-2">Flight Category</span>
      </h1>
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <div
          className={clsx(
            'w-full rounded-md p-4 text-center text-3xl font-semibold tracking-widest',
            {
              'bg-green-500/20 text-green-500': data.flight_category === 'VFR',
              'bg-blue-500/20 text-blue-500': data.flight_category === 'MVFR',
              'bg-red-500/20 text-red-500': data.flight_category === 'IFR',
              'bg-purple-500/20 text-purple-500':
                data.flight_category === 'LIFR',
              'bg-gray-500/20 text-gray-500': data.flight_category === 'UNKN'
            }
          )}
        >
          {data.flight_category}
        </div>
      </div>
    </WidgetWrapper>
  )
}

export default FlightCategory
