import { Icon } from '@iconify/react/dist/iconify.js'
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
        <Icon icon="tabler:plane" className="text-2xl" />
        <span className="ml-2">Flight Category</span>
      </h1>
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <div
          className={`w-full rounded-md p-4 text-center text-3xl font-semibold tracking-widest ${
            {
              VFR: 'bg-green-500/20 text-green-500',
              MVFR: 'bg-blue-500/20 text-blue-500',
              IFR: 'bg-red-500/20 text-red-500',
              LIFR: 'bg-purple-500/20 text-purple-500',
              UNKN: 'bg-gray-500/20 text-gray-500'
            }[data.flight_category]
          }`}
        >
          {data.flight_category}
        </div>
      </div>
    </WidgetWrapper>
  )
}

export default FlightCategory
