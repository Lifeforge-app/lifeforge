import { Icon } from '@iconify/react'
import React from 'react'
import {
  SPICINESS_COLOR,
  SPICINESS_NAME
} from '@constants/todo_subtasks_generation_spiciness'

function SpicinessHeader({
  spiciness
}: {
  spiciness: number
}): React.ReactElement {
  return (
    <>
      <div className="flex w-full flex-between gap-2">
        <div className="flex items-center gap-2">
          <Icon icon="icon-park-outline:chili" className="size-5" />
          <span className="font-medium">Spiciness</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`size-2 rounded-full ${SPICINESS_COLOR[spiciness][1]}`}
          />
          <span>{SPICINESS_NAME[spiciness]}</span>
        </div>
      </div>
      <p className="text-sm text-bg-500">How much breaking down do you need?</p>
    </>
  )
}

export default SpicinessHeader
