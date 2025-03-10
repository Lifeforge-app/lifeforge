import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React, { useMemo } from 'react'
import { isLightColor, oklchToHex } from '@utils/colors'

function ColorItem({
  name,
  value,
  selected,
  onSelect
}: {
  name: string
  value: string
  selected: string
  onSelect: (color: string) => void
}): React.ReactElement {
  const colorHex = useMemo(() => oklchToHex(value), [value])

  return (
    <li key={value} className="w-full">
      <button
        className={clsx(
          'flex-center shadow-custom aspect-square w-full cursor-pointer rounded-md',
          selected === value &&
            'ring-bg-900 ring-offset-bg-100 dark:ring-bg-50 dark:ring-offset-bg-900 ring-2 ring-offset-2'
        )}
        style={{ backgroundColor: value }}
        onClick={() => onSelect(colorHex)}
      >
        {selected === colorHex && (
          <Icon
            className={clsx(
              isLightColor(colorHex) ? 'text-bg-800' : 'text-bg-50',
              'size-8'
            )}
            icon="tabler:check"
          />
        )}
      </button>
      <p className="mt-2 text-xs font-medium">{name}</p>
      <code className="text-bg-500 block text-xs font-medium">{colorHex}</code>
    </li>
  )
}

export default ColorItem
