import { Icon } from '@iconify/react'
import { useQueryClient } from '@tanstack/react-query'

function NavigationButton({
  direction,
  onNavigate
}: {
  direction: 'PREV' | 'NEXT'
  onNavigate: (direction: 'PREV' | 'NEXT') => void
}) {
  const queryClient = useQueryClient()

  return (
    <button
      className="text-bg-500 hover:bg-bg-900 rounded-md p-2 transition-all"
      onClick={() => {
        onNavigate(direction)
        queryClient.invalidateQueries({ queryKey: ['calendar'] })
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
