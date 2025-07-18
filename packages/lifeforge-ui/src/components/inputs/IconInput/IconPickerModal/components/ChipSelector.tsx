import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useState } from 'react'

import Chip from './Chip'

function ChipSelector({
  options,
  value,
  setValue
}: {
  options: string[]
  value: string | null
  setValue: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const [expanded, setExpanded] = useState(false)

  return options.length > 0 ? (
    <div className="mt-4 flex items-center gap-2">
      <div
        className={clsx(
          'flex gap-2 pb-1 transition-all',
          expanded ? 'flex-wrap' : 'overflow-x-auto'
        )}
      >
        {options
          .sort((a, b) => {
            if (a[0] === b[0]) return a.length - b.length

            return a.localeCompare(b)
          })
          .map(option => (
            <Chip
              key={option}
              selected={value === option}
              text={option}
              onClick={() => {
                setValue(value === option ? null : option)
                setExpanded(false)
              }}
            />
          ))}
      </div>
      <button
        className="flex-center text-bg-500 hover:text-bg-800 dark:hover:text-bg-100 h-8 grow gap-2 rounded-full px-2 text-sm whitespace-nowrap transition-all duration-100 md:grow-0"
        type="button"
        onClick={() => {
          setExpanded(!expanded)
        }}
      >
        <Icon
          className={clsx('size-6 transition-all', expanded && 'rotate-180')}
          icon="uil:angle-up"
        />
      </button>
    </div>
  ) : (
    <></>
  )
}

export default ChipSelector
