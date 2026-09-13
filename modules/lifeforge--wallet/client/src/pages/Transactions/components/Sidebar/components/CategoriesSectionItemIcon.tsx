import { Box, Icon } from '@lifeforge/ui'

import useFilter from '@/hooks/useFilter'

function CategoriesSectionItemIcon({
  icon,
  type,
  id
}: {
  icon: string
  type: 'income' | 'expenses' | null
  id: string | null
}) {
  const { category } = useFilter()

  return (
    <Box height="1.75rem" position="relative" width="1.75rem">
      <Icon
        color={category === id ? 'custom-500' : undefined}
        icon={icon}
        size="1.5rem"
      />
      <Box bottom="-0.5rem" position="absolute" right="-0.5rem">
        <Icon
          color={
            type
              ? ({ income: 'green-500', expenses: 'red-500' } as const)[type]
              : 'yellow-500'
          }
          icon={
            type
              ? {
                  income: 'tabler:login-2',
                  expenses: 'tabler:logout'
                }[type]
              : 'tabler:arrow-bar-both'
          }
          size="1rem"
        />
      </Box>
    </Box>
  )
}

export default CategoriesSectionItemIcon
