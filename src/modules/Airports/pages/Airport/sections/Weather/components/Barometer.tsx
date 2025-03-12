import { Icon } from '@iconify/react'

import { IAirportMETARData } from '..'
import WidgetWrapper from './WidgetWrapper'

function Barometer({ data }: { data: IAirportMETARData }) {
  return (
    <WidgetWrapper>
      <h1 className="text-bg-500 mb-2 flex items-center gap-2 text-xl font-semibold">
        <Icon className="text-2xl" icon="uil:monitor" />
        <span className="ml-2">Barometer</span>
      </h1>
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <p className="text-center text-3xl font-medium">
          {data.barometer.hg.toFixed(2)} inHg
        </p>
        <p className="text-bg-500 text-center">
          {data.barometer.kpa.toFixed(2)} kPa ({data.barometer.mb.toFixed(2)}{' '}
          mb)
        </p>
      </div>
    </WidgetWrapper>
  )
}

export default Barometer
