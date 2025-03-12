import { Icon } from '@iconify/react'
import clsx from 'clsx'
import moment from 'moment'

import useComponentBg from '@hooks/useComponentBg'

import { IAirportMETARData } from '..'
import WidgetWrapper from './WidgetWrapper'

function RawMETARData({ data }: { data: IAirportMETARData }) {
  const { componentBgLighter } = useComponentBg()

  return (
    <WidgetWrapper className="col-span-3">
      <div className="flex-between flex">
        <h1 className="text-bg-500 mb-2 flex items-center gap-2 text-xl font-semibold">
          <Icon className="text-2xl" icon="tabler:code" />
          <span className="ml-2">Raw METAR Data</span>
        </h1>
        <span className="text-bg-500">
          Last fetched {moment(data.observed).fromNow()}
        </span>
      </div>
      <code
        className={clsx(
          'text-bg-500 shadow-custom rounded-md p-4',
          componentBgLighter
        )}
      >
        {data.raw_text}
      </code>
    </WidgetWrapper>
  )
}

export default RawMETARData
