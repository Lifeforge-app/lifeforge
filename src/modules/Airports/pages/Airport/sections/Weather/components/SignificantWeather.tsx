import { Icon } from '@iconify/react'
import React from 'react'
import WidgetWrapper from './WidgetWrapper'
import { IAirportMETARData } from '..'
import { METAR_CODES, METAR_ICONS } from '../constants/constants'

function SignificantWeather({
  data
}: {
  data: IAirportMETARData
}): React.ReactElement {
  return (
    <WidgetWrapper className="col-span-2">
      <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold text-bg-500">
        <Icon className="text-2xl" icon="tabler:cloud-exclamation" />
        <span className="ml-2">Weather</span>
      </h1>
      <div className="flex flex-1 items-center justify-center gap-4">
        {data.conditions !== undefined ? (
          <>
            <Icon
              className="text-6xl text-custom-500"
              icon={
                METAR_ICONS[
                  data.conditions?.filter(e => !'+-,VC'.includes(e.code))[0]
                    .code as keyof typeof METAR_ICONS
                ]
              }
            />
            <span className="text-2xl font-medium">
              {data?.conditions
                ?.map(
                  ({ code }) => METAR_CODES[code as keyof typeof METAR_CODES]
                )
                .join(', ')
                .replace(/(Heavy|Light|vicinity),/g, '$1')}
            </span>
          </>
        ) : (
          <span className="text-2xl font-medium">No significant weather</span>
        )}
      </div>
    </WidgetWrapper>
  )
}

export default SignificantWeather
