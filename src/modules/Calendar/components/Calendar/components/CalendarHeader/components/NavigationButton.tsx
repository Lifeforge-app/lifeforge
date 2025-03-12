import { Icon } from '@iconify/react'

function NavigationButton({
  direction,
  onNavigate
}: {
  direction: 'PREV' | 'NEXT'
  onNavigate: (direction: 'PREV' | 'NEXT') => void
}) {
  return (
    <button
      className="text-bg-500 hover:bg-bg-900 rounded-md p-2 transition-all"
      onClick={() => {
        onNavigate(direction)
      }}
    >
      <Icon
        className="size-6"
        icon={`uil:angle-${direction === 'PREV' ? 'left' : 'right'}`}
      />
    </button>
  )
}

export default NavigationButton
