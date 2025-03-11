import { Icon } from '@iconify/react'
import React from 'react'

import { IAirportMETARData } from '..'
import WidgetWrapper from './WidgetWrapper'

function Temperature({
  data
}: {
  data: IAirportMETARData
}): React.ReactElement {
  return (
    <WidgetWrapper>
      <h1 className="text-bg-500 mb-2 flex items-center gap-2 text-xl font-semibold">
        <Icon className="text-2xl" icon="tabler:thermometer" />
        <span className="ml-2">Temperature</span>
      </h1>
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="text-center text-3xl font-medium">
          {data.temperature.celsius.toFixed(2)}°C /{' '}
          {data.temperature.fahrenheit.toFixed(2)}°F
        </p>
      </div>
    </WidgetWrapper>
  )
}

export default Temperature
