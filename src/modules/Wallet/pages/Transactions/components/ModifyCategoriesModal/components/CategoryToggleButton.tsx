import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function CategoryToggleButton({
  categoryType,
  setCategoryType,
  iconName,
  label,
  activeBgColor
}: {
  categoryType: 'income' | 'expenses'
  setCategoryType: (type: 'income' | 'expenses') => void
  iconName: string
  label: string
  activeBgColor: string
}): React.ReactElement {
  return (
    <button
      className={`flex w-1/2 items-center justify-center gap-2 rounded-md p-4 font-medium transition-all ${
        categoryType === label.toLowerCase()
          ? `${activeBgColor} text-bg-800`
          : 'bg-bg-800/50 text-bg-500'
      }`}
      onClick={() => {
        setCategoryType(label.toLowerCase() as 'income' | 'expenses')
      }}
    >
      <Icon icon={iconName} className="size-6" />
      {label}
    </button>
  )
}

export default CategoryToggleButton
