import clsx from 'clsx'
import React from 'react'
import {
  SPICINESS_COLOR,
  SPICINESS_NAME
} from '@constants/todo_subtasks_generation_spiciness'

function SpicinessSlider({
  spiciness,
  setSpiciness
}: {
  spiciness: number
  setSpiciness: (spiciness: number) => void
}): React.ReactElement {
  return (
    <>
      <div className="mt-4 flex items-center justify-evenly gap-2">
        {SPICINESS_NAME.map((_, index) => (
          <button
            key={index}
            className={clsx(
              'size-4 rounded-full',
              SPICINESS_COLOR[index][spiciness === index ? 1 : 2],
              spiciness === index &&
                `ring-2 ring-offset-2 ring-offset-bg-50 dark:ring-offset-bg-800 ${SPICINESS_COLOR[index][3]}`
            )}
            onClick={() => {
              setSpiciness(index)
            }}
          ></button>
        ))}
      </div>
      <div className="flex-between mt-2 flex w-full gap-2">
        <span className="text-sm text-bg-500">Mild</span>
        <span className="h-0.5 w-full rounded-full bg-linear-to-r from-lime-500 to-red-500" />
        <span className="text-sm text-bg-500">Spicy</span>
      </div>
    </>
  )
}

export default SpicinessSlider
