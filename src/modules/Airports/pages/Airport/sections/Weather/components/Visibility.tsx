import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React, { useMemo } from 'react'
import WidgetWrapper from './WidgetWrapper'
import { IAirportMETARData } from '..'

function Visibility({ data }: { data: IAirportMETARData }): React.ReactElement {
  const statusColor = useMemo(() => {
    if (data.visibility.miles_float < 1) {
      return 'bg-red-500/20 text-red-500'
    }
    if (data.visibility.miles_float < 3) {
      return 'bg-yellow-500/20 text-yellow-500'
    }

    return 'bg-green-500/20 text-green-500'
  }, [data])

  return (
    <WidgetWrapper>
      <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold text-bg-500">
        <Icon className="text-2xl" icon="tabler:eye" />
        <span className="ml-2">Visibility</span>
      </h1>
      <div
        className={clsx(
          'flex flex-1 flex-col items-center justify-center gap-2 rounded-md p-4',
          statusColor
        )}
      >
        <p className="text-center text-3xl font-medium">
          {data.visibility.miles} mi{' '}
          <span className="text-lg">({data.visibility.meters} m)</span>
        </p>
      </div>
    </WidgetWrapper>
  )
}

export default Visibility
