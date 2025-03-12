import { Icon } from '@iconify/react'

import { IAirportMETARData } from '..'
import WidgetWrapper from './WidgetWrapper'

function Dewpoint({ data }: { data: IAirportMETARData }) {
  return (
    <WidgetWrapper>
      <h1 className="text-bg-500 mb-2 flex items-center gap-2 text-xl font-semibold">
        <Icon className="text-2xl" icon="tabler:droplet" />
        <span className="ml-2">Dewpoint</span>
      </h1>
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="text-center text-3xl font-medium">
          {data.dewpoint.celsius.toFixed(2)}°C /{' '}
          {data.dewpoint.fahrenheit.toFixed(2)}°F
        </p>
      </div>
    </WidgetWrapper>
  )
}

export default Dewpoint
