import { Icon } from '@iconify/react'
import React from 'react'

function NavigationButton({
  direction,
  onNavigate
}: {
  direction: 'PREV' | 'NEXT'
  onNavigate: (direction: 'PREV' | 'NEXT') => void
}): React.ReactElement {
  return (
    <button
      onClick={() => {
        onNavigate(direction)
      }}
      className="rounded-md p-2 text-bg-500 transition-all hover:bg-bg-900"
    >
      <Icon
        icon={`uil:angle-${direction === 'PREV' ? 'left' : 'right'}`}
        className="h-6 w-6"
      />
    </button>
  )
}

export default NavigationButton
