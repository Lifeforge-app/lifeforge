import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'

import useThemeColors from '@hooks/useThemeColor'

import { IAirportMETARData } from '..'
import { METAR_CODES } from '../constants/constants'
import WidgetWrapper from './WidgetWrapper'

function Clouds({ data }: { data: IAirportMETARData }): React.ReactElement {
  const { componentBgLighter } = useThemeColors()

  return (
    <WidgetWrapper className="col-span-4">
      <h1 className="text-bg-500 mb-2 flex items-center gap-2 text-xl font-semibold">
        <Icon className="text-2xl" icon="tabler:cloud" />
        <span className="ml-2">Clouds</span>
      </h1>
      <ul className="space-y-2">
        {data.clouds !== undefined ? (
          data.clouds.map(cloud => (
            <div
              key={cloud.code}
              className={clsx(
                'flex-between flex rounded-md p-4 pl-6',
                componentBgLighter
              )}
            >
              <p className="text-2xl font-medium">
                {METAR_CODES[cloud.code as keyof typeof METAR_CODES]}
              </p>
              <p className="flex flex-col text-right text-2xl font-medium">
                {cloud.base_feet_agl} ft AGL
                <span className="text-bg-500 text-base font-normal">
                  {cloud.base_meters_agl.toFixed(2)} m AGL
                </span>
              </p>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center p-4 pl-6">
            <p className="text-bg-500 text-xl">No significant clouds</p>
          </div>
        )}
      </ul>
    </WidgetWrapper>
  )
}

export default Clouds
