import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import Chip from './Chip'

function ChipSelector({
  options,
  value,
  setValue
}: {
  options: string[]
  value: string | null
  setValue: React.Dispatch<React.SetStateAction<string | null>>
}): React.ReactElement {
  const [expanded, setExpanded] = useState(false)

  return options.length > 0 ? (
    <div className="mt-4 flex items-center gap-2">
      <div
        className={`flex pb-1 transition-all ${
          expanded ? 'flex-wrap' : 'overflow-x-auto'
        } justify-center gap-2`}
      >
        {options
          .sort((a, b) => {
            if (a[0] === b[0]) return a.length - b.length
            return a.localeCompare(b)
          })
          .map(option => (
            <Chip
              key={option}
              onClick={() => {
                setValue(value === option ? null : option)
                setExpanded(false)
              }}
              selected={value === option}
              text={option}
            />
          ))}
      </div>

      <button
        type="button"
        onClick={() => {
          setExpanded(!expanded)
        }}
        className="flex-center flex h-8 grow gap-2 whitespace-nowrap rounded-full px-2 text-sm text-bg-500 transition-all duration-100 hover:text-bg-800 dark:hover:text-bg-100 md:grow-0"
      >
        <Icon
          icon="uil:angle-up"
          className={`size-6 transition-all ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
    </div>
  ) : (
    <></>
  )
}

export default ChipSelector
