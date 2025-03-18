import {
  SPICINESS_COLOR,
  SPICINESS_NAME
} from '@apps/TodoList/constants/todo_subtasks_generation_spiciness'
import clsx from 'clsx'

function SpicinessSlider({
  spiciness,
  setSpiciness
}: {
  spiciness: number
  setSpiciness: (spiciness: number) => void
}) {
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
                `ring-offset-bg-50 dark:ring-offset-bg-800 ring-2 ring-offset-2 ${SPICINESS_COLOR[index][3]}`
            )}
            onClick={() => {
              setSpiciness(index)
            }}
          ></button>
        ))}
      </div>
      <div className="flex-between mt-2 flex w-full gap-2">
        <span className="text-bg-500 text-sm">Mild</span>
        <span className="bg-linear-to-r h-0.5 w-full rounded-full from-lime-500 to-red-500" />
        <span className="text-bg-500 text-sm">Spicy</span>
      </div>
    </>
  )
}

export default SpicinessSlider
