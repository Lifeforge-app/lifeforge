import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useMemo } from 'react'

import { IAirportMETARData } from '..'
import WidgetWrapper from './WidgetWrapper'

function Ceiling({ data }: { data: IAirportMETARData }) {
  const statusColor = useMemo(() => {
    if (!data.ceiling) {
      return ''
    }

    if (data.ceiling.feet_agl < 1000) {
      return 'bg-red-500/20 text-red-500'
    }

    if (data.ceiling.feet_agl < 3000) {
      return 'bg-yellow-500/20 text-yellow-500'
    }

    return 'bg-green-500/20 text-green-500'
  }, [data])
  return (
    <WidgetWrapper>
      <h1 className="text-bg-500 mb-2 flex items-center gap-2 text-xl font-semibold">
        <Icon className="text-2xl" icon="tabler:arrow-bar-to-up" />
        <span className="ml-2">Celling</span>
      </h1>
      {data.ceiling !== undefined ? (
        <div
          className={clsx(
            'flex flex-1 flex-col items-center justify-center gap-2 rounded-md p-4',
            statusColor
          )}
        >
          <p className="text-center text-3xl font-medium">
            {data.ceiling.feet_agl} ft <span className="text-lg">AGL</span>
          </p>
          <p className="text-center">({data.ceiling.meters_agl} m AGL)</p>
        </div>
      ) : (
        <div className="bg-bg-500/20 text-bg-500 flex flex-1 flex-col items-center justify-center gap-2 rounded-md p-4">
          <p className="text-center text-3xl font-medium">No ceiling</p>
        </div>
      )}
    </WidgetWrapper>
  )
}

export default Ceiling
