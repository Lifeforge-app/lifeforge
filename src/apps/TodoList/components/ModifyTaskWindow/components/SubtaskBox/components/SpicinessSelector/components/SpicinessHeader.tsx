import {
  SPICINESS_COLOR,
  SPICINESS_NAME
} from '@apps/TodoList/constants/todo_subtasks_generation_spiciness'
import { Icon } from '@iconify/react'
import clsx from 'clsx'

function SpicinessHeader({ spiciness }: { spiciness: number }) {
  return (
    <>
      <div className="flex-between flex w-full gap-2">
        <div className="flex items-center gap-2">
          <Icon className="size-5" icon="icon-park-outline:chili" />
          <span className="font-medium">Spiciness</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              'size-2 rounded-full',
              SPICINESS_COLOR[spiciness][1]
            )}
          />
          <span>{SPICINESS_NAME[spiciness]}</span>
        </div>
      </div>
      <p className="text-bg-500 text-sm">How much breaking down do you need?</p>
    </>
  )
}

export default SpicinessHeader
