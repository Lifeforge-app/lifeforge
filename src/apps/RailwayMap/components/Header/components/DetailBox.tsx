import { Icon } from '@iconify/react/dist/iconify.js'
import { useDebounce } from '@uidotdev/usehooks'
import clsx from 'clsx'
import { useCallback } from 'react'

import { Button } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import useComponentBg from '@hooks/useComponentBg'

import { useRailwayMapContext } from '../../../providers/RailwayMapProvider'
import StationCodes from '../../StationCode'

function DetailBox() {
  const open = useModalStore(state => state.open)
  const { componentBg } = useComponentBg()
  const { selectedStation, setRoutePlannerStart } = useRailwayMapContext()
  const innerSelectedStation = useDebounce(
    selectedStation,
    selectedStation ? 0 : 500
  )

  const handleRoutePlannerOpen = useCallback(() => {
    if (!selectedStation) return
    setRoutePlannerStart(selectedStation.id)
    open('railwayMap.routePlanner', {})
  }, [selectedStation])

  return (
    <div
      className={clsx(
        'shadow-custom flex-between flex w-full gap-3 overflow-hidden rounded-md px-6 transition-all duration-500',
        componentBg,
        selectedStation ? 'mt-6 max-h-64 py-4' : 'mt-0 max-h-0 py-0'
      )}
    >
      <div className="flex items-center gap-6 md:gap-3">
        <Icon
          className="size-6 shrink-0"
          icon={
            innerSelectedStation?.type === 'interchange'
              ? 'tabler:transfer'
              : 'uil:subway'
          }
        />
        <div className="flex flex-col-reverse gap-2 md:flex-row md:items-center md:gap-3">
          <div className="text-2xl font-semibold">
            {innerSelectedStation?.name}
          </div>
          <StationCodes codes={innerSelectedStation?.codes ?? []} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          icon="tabler:arrow-left-right"
          variant="plain"
          onClick={handleRoutePlannerOpen}
        />
        <Button icon="tabler:info-circle" variant="plain" />
      </div>
    </div>
  )
}

export default DetailBox
