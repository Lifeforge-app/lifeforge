import { Icon } from '@iconify/react/dist/iconify.js'
import { useDebounce } from '@uidotdev/usehooks'
import clsx from 'clsx'
import React from 'react'
import { Button } from '@components/buttons'
import useThemeColors from '@hooks/useThemeColor'
import { useRailwayMapContext } from '@providers/RailwayMapProvider'
import StationCodes from '../../StationCode'

function DetailBox(): React.ReactElement {
  const { componentBg } = useThemeColors()
  const { selectedStation } = useRailwayMapContext()
  const innerSelectedStation = useDebounce(
    selectedStation,
    selectedStation ? 0 : 500
  )

  return (
    <div
      className={clsx(
        'shadow-custom flex-between flex w-full gap-4 overflow-hidden rounded-md px-6 transition-all duration-500',
        componentBg,
        selectedStation ? 'mt-6 max-h-64 py-4' : 'mt-0 max-h-0 py-0'
      )}
    >
      <div className="flex items-center gap-6 md:gap-4">
        <Icon
          className="size-6 shrink-0"
          icon={
            innerSelectedStation?.type === 'interchange'
              ? 'tabler:transfer'
              : 'uil:subway'
          }
        />
        <div className="flex flex-col-reverse gap-2 md:flex-row md:items-center md:gap-4">
          <div className="text-2xl font-semibold">
            {innerSelectedStation?.name}
          </div>
          <StationCodes codes={innerSelectedStation?.codes ?? []} />
        </div>
      </div>
      <Button icon="tabler:info-circle" variant="no-bg" />
    </div>
  )
}

export default DetailBox
