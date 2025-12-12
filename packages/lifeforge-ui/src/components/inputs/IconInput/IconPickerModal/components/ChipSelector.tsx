import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useCallback, useMemo, useState } from 'react'
import { usePersonalization } from 'shared'

import { TagChip } from '@components/data-display'

function ChipSelector({
  options,
  value,
  onChange
}: {
  options: string[]
  value: string | null
  onChange: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const [expanded, setExpanded] = useState(false)

  const { derivedThemeColor } = usePersonalization()

  const sortedOptions = useMemo(
    () =>
      [...options].sort((a, b) => {
        if (a[0] === b[0]) return a.length - b.length

        return a.localeCompare(b)
      }),
    [options]
  )

  const handleChipClick = useCallback(
    (option: string) => {
      onChange(value === option ? null : option)
      setExpanded(false)
    },
    [onChange, value]
  )

  return options.length > 0 ? (
    <div className="mt-4 flex items-center gap-2">
      <div
        className={clsx(
          'flex gap-2 pb-1 transition-all',
          expanded ? 'flex-wrap' : 'overflow-x-auto'
        )}
      >
        {sortedOptions.map(option => (
          <TagChip
            key={option}
            color={value === option ? derivedThemeColor : undefined}
            label={option}
            onClick={() => handleChipClick(option)}
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
