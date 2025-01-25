import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React from 'react'
import useThemeColors from '@hooks/useThemeColor'
import WidgetWrapper from './WidgetWrapper'
import { IAirportMETARData } from '..'

function RawMETARData({
  data
}: {
  data: IAirportMETARData
}): React.ReactElement {
  const { componentBgLighter } = useThemeColors()

  return (
    <WidgetWrapper className="col-span-3">
      <div className="flex-between flex">
        <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold text-bg-500">
          <Icon icon="tabler:code" className="text-2xl" />
          <span className="ml-2">Raw METAR Data</span>
        </h1>
        <span className="text-bg-500">
          Last fetched {moment(data.observed).fromNow()}
        </span>
      </div>
      <code
        className={`rounded-md p-4 text-bg-500 shadow-custom ${componentBgLighter}`}
      >
        {data.raw_text}
      </code>
    </WidgetWrapper>
  )
}

export default RawMETARData
